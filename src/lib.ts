/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { pushHistory } from '@zextras/carbonio-shell-ui';

import { APP_ID } from './constants';
import { useAppStore } from './stores/app-store';
import type { QueryChip } from './stores/search-store';
import { useSearchStore } from './stores/search-store';

export const { addSearchView } = useAppStore.getState();

export const { removeSearchView } = useAppStore.getState();

export const runSearch = (query: QueryChip[], module: string): void => {
	useSearchStore.setState({ query, module, searchDisabled: false });
	pushHistory({ route: APP_ID, path: '' });
};

export { SearchBar } from './components/search-bar';

export type { ResultsHeaderProps } from './components/results-header';
export { ResultsHeader } from './components/results-header';

export type { SearchViewProps, SearchView } from './stores/app-store';

export type { QueryChip } from './stores/search-store';

export { useQuery, useDisableSearch } from './hooks/hooks';
