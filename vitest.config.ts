/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['@emotion/babel-plugin']]
			}
		})
	],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/vitest-setup.ts'],
		clearMocks: true,
		mockReset: true,
		restoreMocks: true,
		include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
		coverage: {
			enabled: true,
			provider: 'v8',
			reportsDirectory: 'coverage',
			include: ['src/**/*.{js,ts,tsx,jsx}'],
			exclude: ['**/node_modules/**', 'src/tests/**', 'src/types/**', 'src/mocks/**'],
			reporter: ['text', 'cobertura', 'lcov']
		}
	}
});
