/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function addIfNotPresent<T extends { id: unknown }>(
	items: T[],
	itemToAdd: T,
	onAdd?: (items: T[], item: T) => void
): void {
	if (!items.some((item) => item.id === itemToAdd.id)) {
		items.push(itemToAdd);
		onAdd?.(items, itemToAdd);
	}
}

function sortByPosition<T extends { position: number }>(items: T[]): void {
	items.sort((a, b) => a.position - b.position);
}

export function addAndSort<T extends { id: unknown; position: number }>(
	items: T[],
	itemToAdd: T
): void {
	addIfNotPresent(items, itemToAdd, sortByPosition);
}

export function removeById<T extends { id: unknown }>(items: T[], id: unknown): void {
	const index = items.findIndex((item) => item.id === id);
	if (index !== -1) {
		items.splice(index, 1);
	}
}
