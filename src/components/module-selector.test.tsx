/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen } from '@testing-library/react';
import * as Shell from '@zextras/carbonio-shell-ui';

import { ModuleSelector } from './module-selector';
import { APP_ID } from '../constants';
import { app1SearchView, app2SearchView } from '../mocks/utils';
import { useAppStore } from '../stores/app-store';
import { useSearchStore } from '../stores/search-store';
import { SELECTORS } from '../tests/constants';
import { setup, within } from '../tests/utils';

describe('Module selector', () => {
	it('should hide the component if there are no modules in the store', () => {
		setup(<ModuleSelector />);
		expect(screen.queryByTestId(SELECTORS.headerModuleSelector)).not.toBeInTheDocument();
	});

	it('should show the module matching the route', () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		const useCurrentRouteMock = jest.spyOn(Shell, 'useCurrentRoute');
		useCurrentRouteMock.mockReturnValue({
			id: app1SearchView.id,
			route: app1SearchView.route,
			app: app1SearchView.app
		});
		const { rerender } = setup(<ModuleSelector />);
		expect(screen.getByText(app1SearchView.label)).toBeVisible();
		useCurrentRouteMock.mockReturnValue({
			id: app2SearchView.id,
			route: app2SearchView.route,
			app: app2SearchView.app
		});
		rerender(<ModuleSelector />);
		expect(screen.getByText(app2SearchView.label)).toBeVisible();
	});

	it('should show the module name of the registered search views', async () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		useSearchStore.setState({ module: app1SearchView.route });
		const { user } = setup(<ModuleSelector />);
		await user.click(screen.getByText(app1SearchView.label));
		const moduleList = screen.getByTestId(SELECTORS.dropdown);
		expect(within(moduleList).getByText(app1SearchView.label)).toBeVisible();
		expect(within(moduleList).getByTestId(`icon: ${app1SearchView.icon}`)).toBeVisible();
		expect(within(moduleList).getByText(app2SearchView.label)).toBeVisible();
		expect(within(moduleList).getByTestId(`icon: ${app2SearchView.icon}`)).toBeVisible();
	});

	it('should toggle the module list visibility when clicking on the current module', async () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		const { user } = setup(<ModuleSelector />);
		await user.click(screen.getByTestId(SELECTORS.headerModuleSelector));
		expect(screen.getByTestId(SELECTORS.dropdown)).toBeVisible();
		await user.click(screen.getByTestId(SELECTORS.headerModuleSelector));
		expect(screen.queryByTestId(SELECTORS.dropdown)).not.toBeInTheDocument();
	});

	it('should navigate to search module when selecting a module from the selector', async () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		useSearchStore.setState({ module: app1SearchView.route });
		const pushHistory = jest.spyOn(Shell, 'pushHistory');
		const { user } = setup(<ModuleSelector />);
		await user.click(screen.getByText(app1SearchView.label));
		await user.click(screen.getByText(app2SearchView.label));
		expect(pushHistory).toHaveBeenCalledWith({ route: APP_ID, path: '' });
	});
});
