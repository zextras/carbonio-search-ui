/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback } from 'react';

import { SEARCH_MODULE_KEY } from '../constants';
import { useSearchStore } from '../stores/search-store';

export const setSearchModule = (newModule: string): void => {
	sessionStorage.setItem(SEARCH_MODULE_KEY, newModule);
	useSearchStore.getState().updateModule(newModule);
};

export const useSearchModule = (): {
	module: string | undefined;
	setModule: (module: string) => void;
	lastVisibleModule: string | undefined;
	updateLastVisibleModule: () => void;
} => {
	const { module, lastVisibleModule } = useSearchStore();

	const setLastVisibleModule = useCallback(() => {
		useSearchStore.setState({ lastVisibleModule: module });
	}, [module]);

	return {
		module: module ?? sessionStorage.getItem(SEARCH_MODULE_KEY) ?? undefined,
		setModule: setSearchModule,
		lastVisibleModule,
		updateLastVisibleModule: setLastVisibleModule
	};
};
