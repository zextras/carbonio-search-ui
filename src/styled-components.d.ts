/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Theme as DSTheme } from '@zextras/carbonio-design-system';

declare module 'styled-components' {
	interface DefaultTheme extends DSTheme {}
}
