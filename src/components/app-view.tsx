/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useMemo } from 'react';

import { replaceHistory, useCurrentRoute } from '@zextras/carbonio-shell-ui';

import { ResultsHeader } from './results-header';
import { APP_ROUTE } from '../constants';
import { useDisableSearch, useQuery } from '../hooks/hooks';
import { useSearchModule } from '../hooks/use-search-module';
import { useAppStore } from '../stores/app-store';

export const AppView = (): React.JSX.Element => {
	const searchViews = useAppStore((state) => state.views);
	const { module, lastVisibleModule, updateLastVisibleModule } = useSearchModule();

	const searchView = useMemo(
		() => searchViews.find((view) => view.route === module),
		[module, searchViews]
	);

	const currentRoute = useCurrentRoute();

	useEffect(() => {
		if (currentRoute?.route === APP_ROUTE) {
			if (module !== lastVisibleModule) {
				replaceHistory({
					route: APP_ROUTE,
					path: ''
				});
			}
			updateLastVisibleModule();
		}
	}, [currentRoute?.route, lastVisibleModule, module, updateLastVisibleModule]);

	return (
		<>
			{searchView && (
				<searchView.component
					useQuery={useQuery}
					ResultsHeader={ResultsHeader}
					useDisableSearch={useDisableSearch}
				/>
			)}
		</>
	);
};
