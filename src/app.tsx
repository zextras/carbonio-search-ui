/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from 'react';

import {
	ACTION_TYPES,
	addBoard,
	addBoardView,
	addRoute,
	addSettingsView,
	addUtilityView,
	NewAction,
	registerActions,
	setAppContext
} from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

import { Placeholder } from './components/placeholder';
import { APP_ID, MAIN_ROUTE, SECONDARY_ROUTE } from './constants';
import MainAppView from './views/app/view';
import SecondaryRoute from './views/primary-bar/secondary-route';
import View from './views/secondary-bar/view';

const App = (): null => {
	const [t] = useTranslation();
	useEffect(() => {
		const label1 = t('label.app_name', 'Example App');
		const label2 = t('label.secondary_app', 'Example Secondary');

		// primary bar with simple icon
		addRoute({
			id: `${APP_ID}-${MAIN_ROUTE}`,
			route: MAIN_ROUTE,
			position: 100000,
			visible: true,
			label: label1,
			primaryBar: 'CubeOutline',
			secondaryBar: View,
			appView: MainAppView
		});

		// primary bar with custom component
		addRoute({
			id: `${APP_ID}-${SECONDARY_ROUTE}`,
			route: SECONDARY_ROUTE,
			position: 100001,
			visible: true,
			label: label2,
			primaryBar: SecondaryRoute,
			secondaryBar: Placeholder,
			appView: Placeholder
		});

		// settings
		addSettingsView({
			route: MAIN_ROUTE,
			label: label1,
			component: Placeholder
		});
		addSettingsView({
			route: SECONDARY_ROUTE,
			label: label2,
			component: Placeholder
		});

		// boards
		addBoardView({
			id: 'board-view-id1',
			component: Placeholder
		});
		addBoardView({
			id: 'board-view-id2',
			component: Placeholder
		});

		// utility icon buttons
		addUtilityView({
			id: 'utility-1',
			blacklistRoutes: [MAIN_ROUTE],
			button: 'AdminPanelOutline',
			label: t('label.utility_view', 'Test utility view 1'),
			component: Placeholder
		});
		addUtilityView({
			id: 'utility-2',
			blacklistRoutes: [SECONDARY_ROUTE],
			button: 'AwardOutline',
			label: t('label.utility_view2', 'Test utility view 2'),
			component: Placeholder
		});
		addUtilityView({
			id: 'utility-3',
			whitelistRoutes: [SECONDARY_ROUTE],
			button: 'ColorPickerOutline',
			label: t('label.utility_view', 'Test utility view 1'),
			component: Placeholder
		});
		addUtilityView({
			id: 'utility-4',
			whitelistRoutes: [SECONDARY_ROUTE],
			button: 'CrownOutline',
			label: t('label.utility_view2', 'Test utility view 2'),
			component: Placeholder
		});
		addUtilityView({
			id: 'utility-5',
			button: 'CompassOutline',
			label: t('label.utility_view3', 'Test utility view 3'),
			component: Placeholder
		});

		// app context available in all app
		setAppContext({ hello: 'world' });
	}, [t]);

	useEffect(() => {
		// create button actions
		registerActions<NewAction>({
			id: 'new-example',
			type: ACTION_TYPES.NEW,
			action: () => ({
				id: 'new-example',
				label: t('label.example_new', 'New Example'),
				icon: 'CubeOutline',
				execute: (): void => {
					addBoard({ boardViewId: 'board-view-id1', title: 'Main Board' });
				},
				disabled: false,
				primary: true,
				group: MAIN_ROUTE
			})
		});
	}, [t]);

	return null;
};

export default App;
