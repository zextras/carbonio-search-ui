/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { AppView } from './app-view';
import { app1SearchView, app2SearchView } from '../mocks/utils';
import { useAppStore } from '../stores/app-store';
import { useSearchStore } from '../stores/search-store';
import { screen, setup } from '../tests/utils';

describe('App view', () => {
	it('should render the view of the current search module', () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		useSearchStore.setState({ module: app2SearchView.route });

		setup(<AppView />);

		expect(screen.getByText('app2 component')).toBeVisible();
		expect(screen.queryByText('app1 component')).not.toBeInTheDocument();
	});

	it('should render nothing if there is no search view matching the search module', () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		useSearchStore.setState({ module: 'other' });

		setup(<AppView />);

		expect(screen.queryByText('app2 component')).not.toBeInTheDocument();
		expect(screen.queryByText('app1 component')).not.toBeInTheDocument();
	});
});
