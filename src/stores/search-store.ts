/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { ChipItem } from '@zextras/carbonio-design-system';
import { create } from 'zustand';

export type QueryChip = ChipItem<string> & { app?: string };

export type SearchState = {
	query: QueryChip[];
	module?: string;
	lastVisibleModule?: string;
	searchDisabled: boolean;
	tooltip?: string;
};

export type SearchActions = {
	setSearchDisabled: (searchDisabled: boolean) => void;
	updateQuery: (query: QueryChip[] | ((q: QueryChip[]) => QueryChip[])) => void;
	updateModule: (module: string) => void;
};

export const useSearchStore = create<SearchState & SearchActions>()((set, get) => ({
	query: [],
	searchDisabled: false,
	module: undefined,
	lastVisibleModule: undefined,
	tooltip: undefined,
	setSearchDisabled: (searchDisabled: boolean, tooltip?: string): void =>
		set({ searchDisabled, tooltip }),
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)): void =>
		set({ query: typeof query === 'function' ? query(get().query) : query }),
	updateModule: (module: string): void => set({ module })
}));
