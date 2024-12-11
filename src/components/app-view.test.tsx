/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { AppView } from './app-view';
import { app1SearchView, app2SearchView } from '../mocks/utils';
import { useAppStore } from '../stores/app-store';
import { useSearchStore } from '../stores/search-store';
import { getAppI18n, screen, setup } from '../tests/utils';

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

	it('should translate search view with right i18n instance', () => {
		const TestComponent = (): React.JSX.Element => {
			const [t] = useTranslation();

			return <p>{t('key1', 'Default translation')}</p>;
		};
		useAppStore.getState().addSearchView({ ...app1SearchView, component: TestComponent });
		useAppStore.getState().addSearchView({ ...app2SearchView, component: TestComponent });
		useSearchStore.setState({ module: app1SearchView.route });

		getAppI18n(app1SearchView.app).addResources('en', 'translation', {
			key1: 'Translation for app 1'
		});
		getAppI18n(app2SearchView.app).addResources('en', 'translation', {
			key1: 'Translation for app 2'
		});

		setup(<AppView />);

		expect(screen.getByText('Translation for app 1')).toBeVisible();
	});
});
