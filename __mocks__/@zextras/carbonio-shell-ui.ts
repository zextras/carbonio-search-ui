/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type * as Shell from '@zextras/carbonio-shell-ui';

export const addRoute: typeof Shell.addRoute = () => '';
export const registerComponents: typeof Shell.registerComponents = () => '';
export const registerFunctions: typeof Shell.registerFunctions = () => '';
export const pushHistory: typeof Shell.pushHistory = () => {};

const localStorageStore = new Map<string, unknown>();
export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): ReturnType<typeof Shell.useLocalStorage<T>> => [
	(localStorageStore.get(key) as T) ?? initialValue,
	(value: T | ((prev: T) => void)): void => {
		if (value instanceof Function) {
			const currentValue = localStorageStore.get(key);
			localStorageStore.set(key, value(currentValue as T));
		} else {
			localStorageStore.set(key, value);
		}
	}
];

export const useCurrentRoute: typeof Shell.useCurrentRoute = () => undefined;
