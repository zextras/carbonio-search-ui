/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// read the installed core-js version instead of hardcoding it: preset-env needs the
// minor version to polyfill correctly, and a literal would silently drift on every bump
// (and `3.50` as a number would evaluate to 3.5)
const { version: corejsVersion } = require('core-js/package.json');

module.exports = (api) => {
	const presetEnv = api.env('test')
		? {}
		: {
				modules: false,
				useBuiltIns: 'usage',
				corejs: corejsVersion
			};
	return {
		presets: [['@babel/preset-env', presetEnv], '@babel/preset-react', '@babel/preset-typescript'],
		plugins: ['@emotion']
	};
};
