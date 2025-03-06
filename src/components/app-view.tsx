/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useMemo } from 'react';

import { AppContextProvider, useCurrentRoute } from '@zextras/carbonio-shell-ui';
import { useNavigate } from 'react-router-dom';

import { ResultsHeader } from './results-header';
import { APP_ROUTE } from '../constants';
import { useDisableSearch, useQuery } from '../hooks/hooks';
import { useSearchModule } from '../hooks/use-search-module';
import { useAppStore } from '../stores/app-store';

export const AppView = (): React.JSX.Element => {
	const navigate = useNavigate();
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
				navigate(`/${APP_ROUTE}`, { replace: true });
			}
			updateLastVisibleModule();
		}
	}, [currentRoute?.route, lastVisibleModule, module, navigate, updateLastVisibleModule]);

	return (
		<>
			{searchView && (
				<AppContextProvider pkg={searchView.app}>
					<searchView.component
						useQuery={useQuery}
						ResultsHeader={ResultsHeader}
						useDisableSearch={useDisableSearch}
					/>
				</AppContextProvider>
			)}
		</>
	);
};
