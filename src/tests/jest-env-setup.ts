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

beforeAll(() => {
	const retryTimes = process.env.JEST_RETRY_TIMES ? parseInt(process.env.JEST_RETRY_TIMES, 10) : 2;
	jest.retryTimes(retryTimes, { logErrorsBeforeRetry: true });
});

afterAll(() => {});

afterEach(() => {
	jest.runOnlyPendingTimers();
});
