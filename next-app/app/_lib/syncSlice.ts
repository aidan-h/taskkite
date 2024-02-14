import { Draft } from "@reduxjs/toolkit";
import createAppSlice from "./createAppSlice";
import { EventHandlers, InitialState, SyncData, Event, Syncer, pushEvent, fromInitialState, pushAndMoveQueuedEvents, updateClient, handleRejection, SyncState, moveQueuedEvents } from "./sync";

export function syncStateText(status: SyncState): string {
	if (status == SyncState.SYNCING) return "Pending";
	else if (status == SyncState.SYNCED) return "Synced";
	return "Failed";
}

export function syncArraySlice<T, E>(
	name: string,
	initialStates: InitialState<T>[],
	syncer: Syncer<T, E>,
	eventHandlers: EventHandlers<E, T>,
	selector: (rootState: unknown) => SyncData<T, E>[],
) {
	return createAppSlice({
		name,
		initialState: initialStates.map(fromInitialState) as SyncData<T, E>[],
		reducers: (create) => {
			return {
				pushEvent: create.asyncThunk(
					async ({ event, index }: { event: Event<E>, index: number }, thunkApi) =>
						await pushEvent(event, selector(thunkApi.getState())[index], syncer)
					, {
						pending: (syncs, action) =>
							pushAndMoveQueuedEvents(syncs[action.meta.arg.index], action.meta.arg.event as Draft<Event<E>>),
						fulfilled: (syncs, action) => {
							if (action.payload == undefined) return
							updateClient(eventHandlers, syncs[action.meta.arg.index], action.payload);
						},
						rejected: (syncs, action) =>
							handleRejection(syncs[action.meta.arg.index]),
					},
				),
				sync: create.asyncThunk(
					async (index: number, thunkApi) => {
						const syncData = selector(thunkApi.getState())[index]
						if (syncData.state == SyncState.SYNCING)
							throw "already syncing for " + name + " slice"
						return await syncer(syncData, syncData.queuedEvents)
					},
					{
						pending: (syncs, action) => moveQueuedEvents(syncs[action.meta.arg]),
						fulfilled: (syncs, action) => updateClient(eventHandlers, syncs[action.meta.arg], action.payload),
						rejected: (syncs, action) =>
							handleRejection(syncs[action.meta.arg]),
					}
				)
			};
		},
	});
}

export function syncSlice<T, E>(
	name: string,
	initialState: InitialState<T>,
	syncer: Syncer<T, E>,
	eventHandlers: EventHandlers<E, T>,
	selector: (rootState: unknown) => SyncData<T, E>,
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
					async (event: Event<E>, thunkApi) => {
						const syncData = selector(thunkApi.getState())
						if (syncData.state == SyncState.SYNCING)
							return undefined
						return await syncer(syncData, [...syncData.queuedEvents, event])
					}, {
					pending: (syncData, action) => {
						syncData.queuedEvents.push(action.meta.arg as Draft<Event<E>>);
						moveQueuedEvents(syncData);
					},
					fulfilled: (syncData, action) => {
						if (action.payload == undefined) return
						updateClient(eventHandlers, syncData, action.payload);
					},
					rejected: handleRejection,
				}
				),
				sync: create.asyncThunk(
					async (_, thunkApi) => {
						const syncData = selector(thunkApi.getState())
						if (syncData.state == SyncState.SYNCING)
							throw "already syncing for " + name + " slice"
						return await syncer(syncData, syncData.queuedEvents)
					},
					{
						pending: moveQueuedEvents,
						fulfilled: (syncData, action) => updateClient(eventHandlers, syncData, action.payload),
						rejected: handleRejection,
					}
				)
			};
		},
	});
}
