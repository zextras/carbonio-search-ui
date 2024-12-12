/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import failOnConsole from 'jest-fail-on-console';

dotenv.config();

failOnConsole({
	shouldFailOnWarn: true,
	shouldFailOnError: true
});

beforeEach(() => {});

beforeAll(() => {});

afterAll(() => {});

afterEach(() => {
	jest.runOnlyPendingTimers();
});
