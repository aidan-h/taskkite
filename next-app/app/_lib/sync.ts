import { Draft } from "@reduxjs/toolkit";

export type Event<E, N extends keyof E = any> = [N, E[N]]
export enum SyncState {
	SYNCING,
	SYNCED,
	FAILED,
}

export interface SyncData<T, E> {
	data: T,
	shadow: T,
	queuedEvents: Event<E>[],
	proccessingEvents: Event<E>[],
	state: SyncState,
	historyCount: number
}

export type Syncer<T, E> = (syncData: SyncData<T, E>, events: Event<E>[]) => Promise<Event<E>[]>;

export type ApplyEvent<T, E> = (data: Draft<T>, event: Draft<E>) => void;

export interface InitialState<T> {
	data: T,
	historyCount: number,
}

export function fromInitialState<T, E>(initialState: InitialState<T>): SyncData<T, E> {
	return {
		data: initialState.data,
		shadow: initialState.data,
		state: SyncState.SYNCED,
		historyCount: initialState.historyCount,
		queuedEvents: [],
		proccessingEvents: []
	};
}

export function handleRejection<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.state = SyncState.FAILED
	syncData.queuedEvents = syncData.proccessingEvents.concat(syncData.queuedEvents)
	syncData.proccessingEvents = []
}


function applyEvent<T, E>(data: Draft<T>, eventHandlers: EventHandlers<E, T>, event: Draft<Event<E>>) {
	//@ts-ignore
	const handler = eventHandlers[event[0]];
	handler(data, event[1])
}

export function updateClient<T, E>(eventHandlers: EventHandlers<E, T>, syncData: Draft<SyncData<T, E>>, events: Event<E>[]) {
	syncData.state = SyncState.SYNCED;
	events.forEach((e) => applyEvent(syncData.shadow, eventHandlers, e as Draft<Event<E>>));
	syncData.data = { ...syncData.shadow };
	syncData.queuedEvents.forEach((e) => applyEvent(syncData.data, eventHandlers, e));
	syncData.proccessingEvents = [];
}

export function moveQueuedEvents<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.proccessingEvents = syncData.queuedEvents;
	syncData.queuedEvents = [];
	syncData.state = SyncState.SYNCING
}


export type EventHandlers<E, T, R = void> = {
	[Key in keyof E]: (data: Draft<T>, event: E[Key]) => R;
}


export async function pushEvent<T, E>(event: Event<E>, syncData: SyncData<T, E>, syncer: Syncer<T, E>) {
	if (syncData.state == SyncState.SYNCING)
		return undefined
	return await syncer(syncData, [...syncData.queuedEvents, event])
}

export function pushAndMoveQueuedEvents<T, E>(syncData: Draft<SyncData<T, E>>, event: Draft<Event<E>>) {
	syncData.queuedEvents.push(event);
	moveQueuedEvents(syncData);
}
