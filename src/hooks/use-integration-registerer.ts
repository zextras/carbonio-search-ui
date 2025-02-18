/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useEffect } from 'react';

import { registerComponents, registerFunctions } from '@zextras/carbonio-shell-ui';
import { useNavigate } from 'react-router-dom';

import { APP_ROUTE } from '../constants';
import { addSearchView, removeSearchView, ResultsHeader, runSearch, SearchBar } from '../lib';

export const useIntegrationRegisterer = (): void => {
	const navigate = useNavigate();

	const runSearchCallback = useCallback<typeof runSearch>(
		(query, module) => {
			runSearch(query, module);
			navigate(`/${APP_ROUTE}`);
		},
		[navigate]
	);

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
	}, []);

	useEffect(() => {
		registerFunctions({
			id: 'search-run-search',
			fn: runSearchCallback
		});
	}, [runSearchCallback]);
};
