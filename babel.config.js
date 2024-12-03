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
				corejs: 3.39
			};
	return {
		presets: [['@babel/preset-env', presetEnv], '@babel/preset-react', '@babel/preset-typescript'],
		plugins: ['babel-plugin-styled-components']
	};
};
