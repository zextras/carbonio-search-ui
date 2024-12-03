/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { ResultsHeader } from './results-header';
import { useDisableSearch, useQuery } from '../hooks/hooks';
import { useSearchModule } from '../hooks/use-search-module';
import { useAppStore } from '../stores/app-store';

export const AppView = (): React.JSX.Element => {
	const searchViews = useAppStore((state) => state.views);
	const [module] = useSearchModule();

	const searchView = useMemo(
		() => searchViews.find((view) => view.route === module),
		[module, searchViews]
	);

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
