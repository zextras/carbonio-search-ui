/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { SearchActions, SearchState } from '../stores/search-store';
import { useSearchStore } from '../stores/search-store';

export const useQuery = (): [
	query: SearchState['query'],
	updateQuery: SearchActions['updateQuery']
] => {
	const { query, updateQuery } = useSearchStore();
	return [query, updateQuery];
};

export const useDisableSearch = (): [
	isDisabled: SearchState['searchDisabled'],
	setDisabled: SearchActions['setSearchDisabled']
] => {
	const { searchDisabled, setSearchDisabled } = useSearchStore();
	return [searchDisabled, setSearchDisabled];
};
