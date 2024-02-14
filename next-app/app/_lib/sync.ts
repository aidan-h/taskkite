import { Draft } from "@reduxjs/toolkit";

export type Event<E> = [keyof E, E[keyof E]]
export enum SyncState {
	SYNCING,
	SYNCED,
	FAILED,
}

export interface SyncData<T, E> {
	client: HistoricData<T>,
	shadow: HistoricData<T>,
	queuedEvents: Event<E>[],
	proccessingEvents: Event<E>[],
	state: SyncState,
}

export type Syncer<T, E> = (syncData: SyncData<T, E>, events: Event<E>[]) => Promise<Event<E>[]>;

export type ApplyEvent<T, E> = (data: Draft<T>, event: Draft<E>) => void;

export interface HistoricData<T> {
	data: T,
	historyCount: number,
}

export interface InitialState<T> {
	client: HistoricData<T>,
	shadow?: HistoricData<T>,
	syncState?: SyncState,
}

export function createSyncData<T, E>(initialState: InitialState<T>): SyncData<T, E> {
	return {
		client: initialState.client,
		shadow: initialState.client ?? initialState.shadow,
		state: initialState.syncState ?? SyncState.SYNCED,
		queuedEvents: [],
		proccessingEvents: []
	};
}

export function handleRejection<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.state = SyncState.FAILED
	syncData.queuedEvents = syncData.proccessingEvents.concat(syncData.queuedEvents)
	syncData.proccessingEvents = []
}


function applyEvent<T, E>(historicData: Draft<HistoricData<T>>, eventHandlers: EventHandlers<E, T>, event: Draft<Event<E>>) {
	//@ts-ignore
	const handler = eventHandlers[event[0]];
	handler(historicData, event[1])
	historicData.historyCount++;
}

export function updateClient<T, E>(eventHandlers: EventHandlers<E, T>, syncData: Draft<SyncData<T, E>>, events: Event<E>[]) {
	syncData.state = SyncState.SYNCED;
	events.forEach((e) => applyEvent(syncData.shadow, eventHandlers, e as Draft<Event<E>>));
	syncData.client = { ...syncData.shadow };
	syncData.queuedEvents.forEach((e) => applyEvent(syncData.client, eventHandlers, e));
	syncData.proccessingEvents = [];
}

export function moveQueuedEvents<T, E>(syncData: Draft<SyncData<T, E>>) {
	syncData.proccessingEvents = syncData.queuedEvents;
	syncData.queuedEvents = [];
	syncData.state = SyncState.SYNCING
}


export type ServerEventHandlers<E, T, R = void> = {
	[Key in keyof E]: (db: T, event: E[Key]) => R;
}

export type EventHandlers<E, T, R = void> = {
	[Key in keyof E]: (client: Draft<HistoricData<T>>, event: E[Key]) => R;
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
