/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import type { SearchView } from '../stores/app-store';

export const app1SearchView = {
	app: 'app1.app',
	icon: 'Airplane',
	id: 'app1.id',
	label: 'app1.label',
	position: 1,
	route: 'app1.route',
	component: (): React.JSX.Element => <div>app1 component</div>
} as const satisfies SearchView;

export const app2SearchView = {
	app: 'app2.app',
	icon: 'Activity',
	id: 'app2.id',
	label: 'app2.label',
	position: 2,
	route: 'app2.route',
	component: (): React.JSX.Element => <div>app2 component</div>
} as const satisfies SearchView;
