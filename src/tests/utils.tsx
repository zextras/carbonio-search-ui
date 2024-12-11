/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { type ReactElement, useMemo } from 'react';

import { render, type RenderOptions, type RenderResult, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalManager, SnackbarManager, ThemeProvider } from '@zextras/carbonio-design-system';
import i18next, { type i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';

import type { ExtendedQueries } from './queries';
import { extendedQueries } from './queries';
import { APP_ID } from '../constants';

export type UserEvent = ReturnType<(typeof userEvent)['setup']> & {
	readonly rightClick: (target: Element) => Promise<void>;
};

const customWithin = (
	element: Parameters<typeof within<ExtendedQueries>>[0]
): ReturnType<typeof within<ExtendedQueries>> => within(element, extendedQueries);

export const customScreen = customWithin(document.body);

export { customWithin as within, customScreen as screen };

const i18nInstances: Record<string, i18n> = {};
export const getAppI18n = (app: string): i18n => {
	const appI18nInstance = i18nInstances[app];
	if (appI18nInstance !== undefined) {
		return appI18nInstance;
	}
	const newI18n = i18next.createInstance();
	newI18n
		// init i18next
		// for all options read: https://www.i18next.com/overview/configuration-options
		.init({
			lng: 'en',
			fallbackLng: 'en',
			debug: false,

			interpolation: {
				escapeValue: false // not needed for react as it escapes by default
			},
			resources: { en: { translation: {} } }
		});
	i18nInstances[app] = newI18n;
	return newI18n;
};

interface WrapperProps {
	children?: React.ReactNode;
	initialRouterEntries?: string[];
}

export const I18NextTestProvider = ({
	app,
	children
}: {
	app: string;
	children: React.ReactNode;
}): React.JSX.Element => {
	const i18nInstance = useMemo(() => getAppI18n(app), [app]);

	return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

const Wrapper = ({ initialRouterEntries, children }: WrapperProps): React.JSX.Element => (
	<MemoryRouter
		initialEntries={initialRouterEntries}
		initialIndex={
			initialRouterEntries !== undefined && initialRouterEntries.length > 0
				? initialRouterEntries.length - 1
				: 0
		}
	>
		<I18NextTestProvider app={APP_ID}>
			<ThemeProvider>
				<SnackbarManager>
					<ModalManager>{children}</ModalManager>
				</SnackbarManager>
			</ThemeProvider>
		</I18NextTestProvider>
	</MemoryRouter>
);

function customRender(
	ui: React.ReactElement,
	{
		initialRouterEntries = ['/'],
		...options
	}: WrapperProps & {
		options?: Omit<RenderOptions, 'queries' | 'wrapper'>;
	} = {}
): RenderResult<ExtendedQueries> {
	return render(ui, {
		wrapper: ({ children }: Pick<WrapperProps, 'children'>) => (
			<Wrapper initialRouterEntries={initialRouterEntries}>{children}</Wrapper>
		),
		queries: extendedQueries,
		...options
	});
}

type SetupOptions = Pick<WrapperProps, 'initialRouterEntries'> & {
	renderOptions?: Omit<RenderOptions, 'queries'>;
	setupOptions?: Parameters<(typeof userEvent)['setup']>[0];
};

const setupUserEvent = (options: SetupOptions['setupOptions']): UserEvent => {
	const user = userEvent.setup(options);
	const rightClick = (target: Element): Promise<void> =>
		user.pointer({ target, keys: '[MouseRight]' });

	return {
		...user,
		rightClick
	};
};

export const setup = (
	ui: ReactElement,
	options?: SetupOptions
): { user: UserEvent } & ReturnType<typeof customRender> => ({
	user: setupUserEvent({ advanceTimers: jest.advanceTimersByTime, ...options?.setupOptions }),
	...customRender(ui, {
		initialRouterEntries: options?.initialRouterEntries,
		...options?.renderOptions
	})
});
