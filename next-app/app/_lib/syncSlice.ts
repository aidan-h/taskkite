import { Draft, ReducerCreators, SliceCaseReducers, SliceSelectors } from "@reduxjs/toolkit";
import createAppSlice from "./createAppSlice";
import { EventHandlers, InitialState, SyncData, Event, Syncer, pushEvent, createSyncData, pushAndMoveQueuedEvents, updateClient, handleRejection, SyncState, moveQueuedEvents } from "./sync";

export function syncStateText(status: SyncState): string {
	if (status == SyncState.SYNCING) return "Pending";
	else if (status == SyncState.SYNCED) return "Synced";
	return "Failed";
}

function createArrayPush<T, E>(
	create: ReducerCreators<SyncData<T, E>[]>,
	selector: (rootState: unknown) => SyncData<T, E>[],
	eventHandlers: EventHandlers<E, T>,
	syncer: Syncer<T, E>,
) {
	return create.asyncThunk(
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
	);
}
function createArraySync<T, E>(
	create: ReducerCreators<SyncData<T, E>[]>,
	selector: (rootState: unknown) => SyncData<T, E>[],
	eventHandlers: EventHandlers<E, T>,
	syncer: Syncer<T, E>,

) {

	return create.asyncThunk(
		async (index: number, thunkApi) => {
			const syncData = selector(thunkApi.getState())[index]
			if (syncData.state == SyncState.SYNCING)
				throw "already syncing slice"
			return await syncer(syncData, syncData.queuedEvents)
		},
		{
			pending: (syncs, action) => moveQueuedEvents(syncs[action.meta.arg]),
			fulfilled: (syncs, action) => updateClient(eventHandlers, syncs[action.meta.arg], action.payload),
			rejected: (syncs, action) =>
				handleRejection(syncs[action.meta.arg]),
		}
	);
}
export type ArraySync<T, E> = ReturnType<typeof createArraySync<T, E>>;
export type ArrayPush<T, E> = ReturnType<typeof createArrayPush<T, E>>;
export function syncArraySlice<T, E, N extends string, CR extends SliceCaseReducers<SyncData<T, E>[]> = SliceCaseReducers<SyncData<T, E>[]>>(
	name: N,
	initialStates: InitialState<T>[],
	syncer: Syncer<T, E>,
	eventHandlers: EventHandlers<E, T>,
	selector: (rootState: unknown) => SyncData<T, E>[],
	reducerCreators: (create: ReducerCreators<SyncData<T, E>[]>,
		sync: ArraySync<T, E>,
		push: ArrayPush<T, E>,
	) => CR,
) {
	return createAppSlice<SyncData<T, E>[], CR, N, SliceSelectors<SyncData<T, E>[]>>({
		name,
		initialState: initialStates.map(createSyncData<T, E>),
		reducers: (create) =>
			reducerCreators(create, createArraySync(
				create, selector, eventHandlers, syncer
			), createArrayPush(create, selector, eventHandlers, syncer))
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
		initialState: createSyncData<T, E>(initialState),
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
