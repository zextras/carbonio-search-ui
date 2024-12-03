/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import MainUtilityView from './main-view';
import { screen, setup } from '../../tests/utils';

describe('Main utility view', () => {
	it('should show main label', () => {
		setup(<MainUtilityView />);
		expect(screen.getByText('This is a view')).toBeVisible();
	});
});
