"use client";
import { useEffect, useState } from "react";

export enum SyncStatus {
	PENDING,
	SYNCED,
	FAILED,
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
	const [state, setState] = useState<SyncState<T>>({
		status: SyncStatus.PENDING,
		data: undefined,
	});

	function fetchData() {
		if (state.data == undefined || state.status != SyncStatus.PENDING) {
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
	useEffect(fetchData, []);

	return {
		state: state,
		setState: setState,
		fetch: fetchData,
	};
}

export interface Shadow<T, E> {
	queuedEvents: E[];
	data: T;
}

export interface IncrementalData<T, E> {
	emit: (event: E) => void;
	fetch: () => void;
	data: T | undefined;
}

function pushEvents<T, E>(
	syncClient: SyncClient<T>,
	shadow: Shadow<T, E>,
	sync: (events: E[], data: T) => Promise<E[]>,
	applyEvent: (data: T, event: E) => T,
) {
	const events = shadow.queuedEvents;
	shadow.queuedEvents = [];
	syncClient.setState({
		data: syncClient.state.data,
		status: SyncStatus.PENDING,
	});

	sync(events, shadow.data)
		.then((serverEvents) => {

			serverEvents.forEach((event) => { shadow.data = applyEvent(shadow.data, event) });
			syncClient.setState({
				status: SyncStatus.SYNCED,
				data: structuredClone(shadow.data),
			});
		})
		.catch((err) => {
			console.error(err);
			shadow.queuedEvents = events.concat(shadow.queuedEvents);
			syncClient.setState({
				data: syncClient.state.data,
				status: SyncStatus.FAILED,
			});
		});
}

export function useIncrementalData<T, E>(
	fetcher: () => Promise<T>,
	sync: (events: E[], data: T) => Promise<E[]>,
	applyEvent: (data: T, event: E) => T,
): IncrementalData<T, E> {
	const syncClient = useSyncClient(fetcher);
	const [shadow, setShadow] = useState<Shadow<T, E> | undefined>(undefined);

	if (!shadow && syncClient.state.data) {
		setShadow({
			data: syncClient.state.data,
			queuedEvents: [],
		});
	}

	if (
		shadow &&
		syncClient.state.status != SyncStatus.PENDING &&
		shadow.queuedEvents.length > 0
	) {
		pushEvents(syncClient, shadow, sync, applyEvent);
	}

	return {
		emit: (event) => {
			if (!syncClient.state.data || !shadow) {
				console.error("couldn't process event without data" + event);
				return;
			}

			syncClient.setState({
				status: syncClient.state.status,
				data: applyEvent(syncClient.state.data, event),
			});
			shadow.queuedEvents.push(event);

			if (syncClient.state.status == SyncStatus.PENDING)
				return
			pushEvents(syncClient, shadow, sync, applyEvent);
		},
		fetch: () => { },
		data: syncClient.state.data,
	};
}
