/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from 'react';

import { addRoute } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

import { AppView } from './components/app-view';
import { APP_ID, APP_ROUTE } from './constants';
import { useIntegrationRegisterer } from './hooks/use-integration-registerer';

const App = (): null => {
	const [t] = useTranslation();
	useEffect(() => {
		addRoute({
			id: APP_ID,
			app: APP_ID,
			route: APP_ROUTE,
			appView: AppView,
			badge: {
				show: false
			},
			label: t('search.app', 'Search'),
			position: 1000,
			visible: true,
			primaryBar: 'SearchModOutline'
		});
	}, [t]);

	useIntegrationRegisterer();

	return null;
};

export default App;
