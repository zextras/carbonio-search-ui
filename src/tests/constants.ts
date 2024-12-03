/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const SELECTORS = {
	headerModuleSelector: 'HeaderModuleSelector',
	dropdown: 'dropdown-popper-list',
	chip: 'chip',
	icons: {
		clearSearch: 'BackspaceOutline',
		search: 'Search',
		resultsWarning: 'AlertTriangle',
		resultsError: 'CloseSquare'
	}
} as const;

export const TIMERS = {
	tooltip: 500
} as const;
