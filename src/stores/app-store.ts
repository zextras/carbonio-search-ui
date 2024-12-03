/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type React from 'react';

import { produce } from 'immer';
import { create } from 'zustand';

import type { ResultsHeader } from '../components/results-header';
import { SEARCH_MODULE_KEY } from '../constants';
import { useSearchStore } from './search-store';
import type { useDisableSearch, useQuery } from '../hooks/hooks';
import { addAndSort, removeById } from '../utils/utils';

export type SearchViewProps = {
	useQuery: typeof useQuery;
	ResultsHeader: typeof ResultsHeader;
	useDisableSearch: typeof useDisableSearch;
};

export type SearchView = {
	id: string;
	app: string;
	route: string;
	component: React.ComponentType<SearchViewProps>;
	icon: string;
	label: string;
	position: number;
};

type AppState = {
	views: SearchView[];
};

type AppActions = {
	addSearchView: (data: SearchView) => string;
	removeSearchView: (id: string) => void;
};

export const useAppStore = create<AppState & AppActions>()((set, get) => ({
	views: [],
	addSearchView: (data): string => {
		const { views } = get();

		const lastSearchModule = sessionStorage.getItem(SEARCH_MODULE_KEY) ?? undefined;
		const currentSearchModule = useSearchStore.getState().module;

		if (currentSearchModule !== lastSearchModule || currentSearchModule === undefined) {
			const currentModuleSearchView = views.find(
				(searchView) => searchView.route === currentSearchModule
			);
			if (
				!currentModuleSearchView ||
				data.position < currentModuleSearchView?.position ||
				data.route === lastSearchModule
			) {
				useSearchStore.getState().updateModule(data.route);
			}
		}
		set(
			produce<AppState>((state) => {
				addAndSort(state.views, data);
			})
		);
		return data.id;
	},
	removeSearchView: (id): void => {
		set(
			produce<AppState>((state) => {
				removeById(state.views, id);
			})
		);
	}
}));
