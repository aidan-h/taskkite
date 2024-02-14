import { Draft } from "@reduxjs/toolkit";
import createAppSlice from "./createAppSlice";

export enum SyncState {
	SYNCING,
	SYNCED,
	FAILED,
}

export interface SyncData<T, E> {
	data: T,
	shadow: T,
	queuedEvents: E[],
	proccessingEvents: E[],
	state: SyncState,
	historyCount: number
}

export type Syncer<E> = (historyCount: number, events: E[]) => Promise<E[]>;

export type ApplyEvent<T, E> = (data: Draft<T>, event: Draft<E>) => void;

export interface InitialState<T> {
	data: T,
	historyCount: number,
}

function fromInitialState<T, E>(initialState: InitialState<T>): SyncData<T, E> {
	return {
		data: initialState.data,
		shadow: initialState.data,
		state: SyncState.SYNCED,
		historyCount: initialState.historyCount,
		queuedEvents: [],
		proccessingEvents: []
	};
}

function handleRejection<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.state = SyncState.FAILED
	syncData.queuedEvents = syncData.proccessingEvents.concat(syncData.queuedEvents)
	syncData.proccessingEvents = []
}
function updateClient<T, E>(applyEvent: ApplyEvent<T, E>, syncData: Draft<SyncData<T, E>>, events: E[]) {
	syncData.state = SyncState.SYNCED;
	events.forEach((e) => {
		applyEvent(syncData.shadow, e as Draft<E>)
	});
	syncData.data = { ...syncData.shadow };
	syncData.queuedEvents.forEach((e) => applyEvent(syncData.data, e));
	syncData.proccessingEvents = [];
}
function moveQueuedEvents<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.proccessingEvents = syncData.queuedEvents;
	syncData.queuedEvents = [];
	syncData.state = SyncState.SYNCING
}



export function syncArraySlice<T, E, S>(
	name: string,
	initialStates: InitialState<T>[],
	syncer: Syncer<E>,
	applyEvent: ApplyEvent<T, E>,
	selector: (rootState: S) => SyncData<T, E>[],
) {
	return createAppSlice({
		name,
		initialState: initialStates.map(fromInitialState) as SyncData<T, E>[],
		reducers: (create) => {
			return {
				pushEvent: create.asyncThunk(
					async ({ event, index }: { event: E, index: number }, thunkApi) => {
						const syncData = selector(thunkApi.getState() as S)[index]
						if (syncData.state == SyncState.SYNCING)
							return undefined
						return await syncer(syncData.historyCount, [...syncData.queuedEvents, event])
					}, {
					pending: (syncs, action) => {
						const syncData = syncs[action.meta.arg.index];
						syncData.queuedEvents.push(action.meta.arg as Draft<E>);
						moveQueuedEvents(syncData);
					},
					fulfilled: (syncs, action) => {
						const syncData = syncs[action.meta.arg.index];
						if (action.payload == undefined) return
						updateClient(applyEvent, syncData, action.payload);
					},
					rejected: (syncs, action) =>
						handleRejection(syncs[action.meta.arg.index]),
				},
				),
				sync: create.asyncThunk(
					async (index: number, thunkApi) => {
						const syncData = selector(thunkApi.getState() as S)[index]
						if (syncData.state == SyncState.SYNCING)
							throw "already syncing for " + name + " slice"
						return await syncer(syncData.historyCount, syncData.queuedEvents)
					},
					{
						pending: (syncs, action) => moveQueuedEvents(syncs[action.meta.arg]),
						fulfilled: (syncs, action) => updateClient(applyEvent, syncs[action.meta.arg], action.payload),
						rejected: (syncs, action) =>
							handleRejection(syncs[action.meta.arg]),
					}
				)
			};
		},
	});
}

export function syncSlice<T, E, S>(
	name: string,
	initialState: InitialState<T>,
	syncer: Syncer<E>,
	applyEvent: ApplyEvent<T, E>,
	selector: (rootState: S) => SyncData<T, E>,
) {
	return createAppSlice({
		name,
		initialState: {
			data: initialState.data,
			shadow: initialState.data,
			state: SyncState.SYNCED,
			historyCount: initialState.historyCount,
			queuedEvents: [],
			proccessingEvents: []
		} as SyncData<T, E>,
		reducers: (create) => {
			return {
				pushEvent: create.asyncThunk(
					async (event: E, thunkApi) => {
						const syncData = selector(thunkApi.getState() as S)
						if (syncData.state == SyncState.SYNCING)
							return undefined
						return await syncer(syncData.historyCount, [...syncData.queuedEvents, event])
					}, {
					pending: (syncData, action) => {
						syncData.queuedEvents.push(action.meta.arg as Draft<E>);
						moveQueuedEvents(syncData);
					},
					fulfilled: (syncData, action) => {
						if (action.payload == undefined) return
						updateClient(applyEvent, syncData, action.payload);
					},
					rejected: handleRejection,
				}
				),
				sync: create.asyncThunk(
					async (_, thunkApi) => {
						const syncData = selector(thunkApi.getState() as S)
						if (syncData.state == SyncState.SYNCING)
							throw "already syncing for " + name + " slice"
						return await syncer(syncData.historyCount, syncData.queuedEvents)
					},
					{
						pending: moveQueuedEvents,
						fulfilled: (syncData, action) => updateClient(applyEvent, syncData, action.payload),
						rejected: handleRejection,
					}
				)
			};
		},
	});
}
