/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { runSearch } from './lib';
import type { QueryChip } from './stores/search-store';
import { useSearchStore } from './stores/search-store';

describe('runSearch', () => {
	it('should update the store and navigate to the search module', () => {
		const query = [{ id: 'a', label: 'b', value: 'c' }] satisfies QueryChip[];
		runSearch(query, 'module-route');
		expect(useSearchStore.getState()).toMatchObject({
			query,
			module: 'module-route',
			searchDisabled: false
		});
	});
});
