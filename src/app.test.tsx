/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import * as Shell from '@zextras/carbonio-shell-ui';

import App from './app';
import { APP_ID, MAIN_ROUTE, SECONDARY_ROUTE } from './constants';
import { setup } from './tests/utils';

describe('App', () => {
	it('should register main route', () => {
		const addRouteFn = jest.spyOn(Shell, 'addRoute');
		setup(<App />);
		expect(addRouteFn).toHaveBeenCalledWith(
			expect.objectContaining<Parameters<typeof Shell.addRoute>[0]>({
				id: `${APP_ID}-${MAIN_ROUTE}`,
				route: MAIN_ROUTE
			})
		);
		expect(addRouteFn).toHaveBeenCalledWith(
			expect.objectContaining<Parameters<typeof Shell.addRoute>[0]>({
				id: `${APP_ID}-${SECONDARY_ROUTE}`,
				route: SECONDARY_ROUTE
			})
		);
	});

	it('should register secondary route', () => {
		const addRouteFn = jest.spyOn(Shell, 'addRoute');
		setup(<App />);
		expect(addRouteFn).toHaveBeenCalledWith(
			expect.objectContaining<Parameters<typeof Shell.addRoute>[0]>({
				id: `${APP_ID}-${SECONDARY_ROUTE}`,
				route: SECONDARY_ROUTE
			})
		);
	});
});
