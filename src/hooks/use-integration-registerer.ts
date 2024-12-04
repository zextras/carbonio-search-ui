/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

import { registerComponents, registerFunctions } from '@zextras/carbonio-shell-ui';

import { addSearchView, removeSearchView, ResultsHeader, runSearch, SearchBar } from '../lib';

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
			fn: addSearchView
		});
		registerFunctions({
			id: 'search-remove-view',
			fn: removeSearchView
		});
		registerFunctions({
			id: 'search-run-search',
			fn: runSearch
		});
	}, []);
};
