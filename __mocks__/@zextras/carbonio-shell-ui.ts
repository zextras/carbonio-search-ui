/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type * as Shell from '@zextras/carbonio-shell-ui';

import { APP_ID } from '../../src/constants';

export const addRoute: typeof Shell.addRoute = () => '';
export const addSettingsView: typeof Shell.addSettingsView = () => '';
export const addBoardView: typeof Shell.addBoardView = () => '';
export const addUtilityView: typeof Shell.addUtilityView = () => '';
export const setAppContext: typeof Shell.setAppContext = () => '';
export const registerActions: typeof Shell.registerActions = () => '';
export const addBoard = <T>(
	board: Parameters<typeof Shell.addBoard<T>>[0]
): ReturnType<typeof Shell.addBoard<T>> =>
	({
		id: APP_ID,
		app: APP_ID,
		icon: 'CubeOutline',
		...board
	}) as Shell.Board;

export const ACTION_TYPES = {
	NEW: 'new'
};
