/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

import { registerComponents, registerFunctions } from '@zextras/carbonio-shell-ui';

import { ResultsHeader } from '../components/results-header';
import { SearchBar } from '../components/search-bar';
import type { SearchView } from '../stores/app-store';
import { useAppStore } from '../stores/app-store';
import { runSearch } from '../utils/utils';

const addSearchViewIntegrationFunction: (data: SearchView) => string =
	useAppStore.getState().addSearchView;

const removeSearchViewIntegrationFunction: (id: string) => void =
	useAppStore.getState().removeSearchView;

export const useIntegrationRegisterer = (): void => {
	useEffect(() => {
		registerComponents({
			id: 'search-bar',
			component: SearchBar
		});

		registerComponents({
			id: 'search-results-header',
			component: ResultsHeader
		});

		registerFunctions({
			id: 'search-add-view',
			fn: addSearchViewIntegrationFunction
		});
		registerFunctions({
			id: 'search-remove-view',
			fn: removeSearchViewIntegrationFunction
		});
		registerFunctions({
			id: 'search-run-search',
			fn: runSearch
		});
	}, []);
};
