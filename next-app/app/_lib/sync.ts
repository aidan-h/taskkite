"use client";

import { useEffect, useState } from "react";

export enum SyncStatus {
	PENDING,
	SYNCED,
	FAILED,
	WAITING,
}

export function syncStatusText(status: SyncStatus): string {
	if (status == SyncStatus.PENDING) return "Pending"
	else if (status == SyncStatus.SYNCED) return "Synced"
	return "Failed"
}

export interface SyncState<T> {
	status: SyncStatus;
	data: T | undefined;
}

export interface SyncClient<T> {
	fetch: () => void;
	setState: (state: SyncState<T>) => void;
	state: SyncState<T>;
}

export function useSyncClient<T>(fetcher: () => Promise<T>): SyncClient<T> {
	const [syncState, setSyncState] = useState({ status: SyncStatus.SYNCED, data: undefined } as SyncState<T>)
	const fetch = createSyncFetch(syncState, setSyncState, fetcher);
	useEffect(fetch, [])
	return { setState: setSyncState, state: syncState, fetch: fetch }
}

export function createSyncFetch<T>(state: SyncState<T>, setState: (state: SyncState<T>) => void, fetcher: () => Promise<T>): () => void {
	return () => {
		if (state.status != SyncStatus.PENDING) {
			setState({
				status: SyncStatus.PENDING,
				data: state.data,
			});
			fetcher()
				.then((d) =>
					setState({
						status: SyncStatus.SYNCED,
						data: d,
					}),
				)
				.catch(() => setState({ status: SyncStatus.FAILED, data: state.data }));
		}
	}
}

export interface Shadow<T, E> {
	queuedEvents: E[];
	data: T;
}

export type PushEvent<E> = (event: E) => void;

function pushEvents<T, E>(
	state: SyncState<T>,
	setState: (state: SyncState<T>) => void,
	shadow: Shadow<T, E>,
	sync: (events: E[], data: T) => Promise<E[]>,
	applyEvent: (data: T, event: E) => T,
) {
	const events = shadow.queuedEvents;
	shadow.queuedEvents = [];
	setState({
		data: state.data,
		status: SyncStatus.PENDING,
	});

	sync(events, shadow.data)
		.then((serverEvents) => {
			serverEvents.forEach((event) => {
				shadow.data = applyEvent(shadow.data, event);
			});
			setState({
				status: SyncStatus.SYNCED,
				data: structuredClone(shadow.data),
			});
		})
		.catch((err) => {
			console.error(err);
			shadow.queuedEvents = events.concat(shadow.queuedEvents);
			setState({
				data: state.data,
				status: SyncStatus.FAILED,
			});
		});
}

export function getPushEvent<T, E>(
	sync: (events: E[], data: T) => Promise<E[]>,
	state: SyncState<T>,
	setState: (state: SyncState<T>) => void,
	applyEvent: (data: T, event: E) => T,
	shadow: Shadow<T, E> | undefined,
	setShadow: (shadow: Shadow<T, E> | undefined) => void,
): PushEvent<E> {
	if (!shadow && state.data) {
		setShadow({
			data: state.data,
			queuedEvents: [],
		});
	}

	if (
		shadow &&
		state.status == SyncStatus.SYNCED &&
		shadow.queuedEvents.length > 0
	) {
		pushEvents(state, setState, shadow, sync, applyEvent);
	}

	return (event) => {
		if (!state.data || !shadow) {
			console.error("couldn't process event without data" + event);
			return;
		}

		setState({
			status: state.status,
			data: applyEvent(state.data, event),
		});
		shadow.queuedEvents.push(event);

		if (state.status == SyncStatus.PENDING) return;
		pushEvents(state, setState, shadow, sync, applyEvent);
	}
}
