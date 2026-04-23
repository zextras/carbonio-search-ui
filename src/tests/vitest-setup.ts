/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom/vitest';
import dotenv from 'dotenv';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

// Auto-mock modules that have __mocks__ directories (Vitest equivalent of Jest's automatic mocking)
vi.mock('@zextras/carbonio-shell-ui');
vi.mock('zustand');

dotenv.config();

beforeEach(() => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
});

beforeAll(() => {});

afterAll(() => {});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

// mock a simplified crypto
Object.defineProperty(window.crypto, 'randomUUID', {
	writable: true,
	value: vi.fn(() => Math.random().toString())
});
