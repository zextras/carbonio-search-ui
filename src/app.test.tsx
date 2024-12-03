/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import * as Shell from '@zextras/carbonio-shell-ui';

import App from './app';
import { AppView } from './components/app-view';
import { ResultsHeader } from './components/results-header';
import { SearchBar } from './components/search-bar';
import { APP_ID } from './constants';
import { setup } from './tests/utils';
import { runSearch } from './utils/utils';

describe('App', () => {
	it('should register search route', () => {
		const addRouteFn = jest.spyOn(Shell, 'addRoute');
		setup(<App />);
		expect(addRouteFn).toHaveBeenCalledWith(
			expect.objectContaining<Parameters<typeof Shell.addRoute>[0]>({
				id: APP_ID,
				app: APP_ID,
				route: APP_ID,
				appView: AppView,
				badge: {
					show: false
				},
				label: 'Search',
				position: 1000,
				visible: true,
				primaryBar: 'SearchModOutline'
			})
		);
	});

	it('should register SearchBar component integration', () => {
		const registerComponentsFn = jest.spyOn(Shell, 'registerComponents');
		setup(<App />);
		expect(registerComponentsFn).toHaveBeenCalledWith({
			id: 'search-bar',
			component: SearchBar
		});
	});

	it('should register ResultsHeader component integration', () => {
		const registerComponentsFn = jest.spyOn(Shell, 'registerComponents');
		setup(<App />);
		expect(registerComponentsFn).toHaveBeenCalledWith({
			id: 'search-results-header',
			component: ResultsHeader
		});
	});

	it('should register runSearch function integration', () => {
		const registerFunctionsFn = jest.spyOn(Shell, 'registerFunctions');
		setup(<App />);
		expect(registerFunctionsFn).toHaveBeenCalledWith({
			id: 'search-run-search',
			fn: runSearch
		});
	});

	it('should register addSearchView function integration', () => {
		const registerFunctionsFn = jest.spyOn(Shell, 'registerFunctions');
		setup(<App />);
		expect(registerFunctionsFn).toHaveBeenCalledWith({
			id: 'search-add-view',
			fn: expect.any(Function)
		});
	});

	it('should register removeSearchView function integration', () => {
		const registerFunctionsFn = jest.spyOn(Shell, 'registerFunctions');
		setup(<App />);
		expect(registerFunctionsFn).toHaveBeenCalledWith({
			id: 'search-remove-view',
			fn: expect.any(Function)
		});
	});
});
