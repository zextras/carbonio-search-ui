/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
module.exports = (api) => {
	const presetEnv = api.env('test')
		? {}
		: {
				modules: false,
				useBuiltIns: 'usage',
				// keep in sync with the core-js version in package.json: preset-env wants a string
				// with the minor version, and the number 3.50 would evaluate to 3.5
				corejs: '3.50'
			};
	return {
		presets: [['@babel/preset-env', presetEnv], '@babel/preset-react', '@babel/preset-typescript'],
		plugins: ['@emotion']
	};
};
