/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import * as Shell from '@zextras/carbonio-shell-ui';
import { Link } from 'react-router-dom';

import { SearchBar } from './search-bar';
import { LOCAL_STORAGE_SEARCH_KEY, SEARCH_MODULE_KEY } from '../constants';
import { app1SearchView, app2SearchView } from '../mocks/utils';
import { useAppStore } from '../stores/app-store';
import { useSearchStore } from '../stores/search-store';
import { SELECTORS, TIMERS } from '../tests/constants';
import { screen, setup, within } from '../tests/utils';

describe('Search bar', () => {
	describe('Clear search', () => {
		it('should hide the clear button, by default, when the search input is empty or not valued', () => {
			setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			expect(inputElement).toBeVisible();
			expect(inputElement).toHaveValue('');
			expect(
				screen.queryByRoleWithIcon('button', { icon: SELECTORS.icons.clearSearch })
			).not.toBeInTheDocument();
		});

		it('should clear the input element when the user clicks on clear button', async () => {
			const { user } = setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			const textContent = 'test';
			await user.type(inputElement, textContent);
			await user.keyboard(',');
			await user.type(inputElement, 'test2');
			await user.click(screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.clearSearch }));
			expect(inputElement).toHaveValue('');
			expect(inputElement).toHaveFocus();
			expect(screen.queryByText(textContent)).not.toBeInTheDocument();
		});
	});

	describe('Search button', () => {
		it('should disable the search button, by default, when the input element is empty and there are no chips', async () => {
			setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			expect(inputElement).toBeVisible();
			expect(inputElement).toHaveValue('');
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			expect(searchButton).toBeVisible();
			expect(searchButton).toBeDisabled();
		});

		it('should enable the search button when the user starts typing inside the input element', async () => {
			const { user } = setup(<SearchBar />);
			await user.type(screen.getByRole('textbox', { name: /search in/i }), 'test');
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			await waitFor(() => expect(searchButton).toBeEnabled());
			jest.advanceTimersToNextTimer();
			await user.hover(searchButton);
			act(() => {
				// run timers of tooltip
				jest.advanceTimersToNextTimer();
			});
			expect(
				await screen.findByText(/Type or choose some keywords to start a search/i)
			).toBeVisible();
		});

		it.each(['[Enter]', ',', '[Space]'])(
			'should enable the search button when the user presses keyboard key (%s) to add the chips',
			async (key) => {
				const { user } = setup(<SearchBar />);
				const inputElement = screen.getByRole('textbox', { name: /search in/i });
				const chip1 = 'test';
				await user.type(inputElement, chip1);
				await user.keyboard(key);
				expect(screen.getByText(chip1)).toBeVisible();
				expect(inputElement).toHaveValue('');
				const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
				expect(searchButton).toBeEnabled();
				await act(async () => {
					await jest.advanceTimersToNextTimerAsync();
				});
				await user.hover(searchButton);
				await act(async () => {
					// run timers of tooltip
					await jest.advanceTimersToNextTimerAsync();
				});
				expect(await screen.findByText(/Start search/i)).toBeVisible();
			}
		);

		it('should render the chips when the user clicks on the search button', async () => {
			const { user } = setup(<SearchBar />);
			const inputElement = screen.getByRole('textbox', { name: /search in/i });
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			const chip1 = 'test';
			const chip2 = 'test2';
			await user.type(inputElement, chip1);
			await user.click(searchButton);
			await act(async () => {
				// run tooltip timer
				await jest.advanceTimersByTimeAsync(TIMERS.tooltip);
			});
			await user.type(inputElement, 'test2');
			await user.click(searchButton);
			await act(async () => {
				// run tooltip timers
				await jest.advanceTimersByTimeAsync(TIMERS.tooltip);
			});
			expect(screen.getByText(chip1)).toBeVisible();
			expect(screen.getByText(chip2)).toBeVisible();
			expect(inputElement).not.toHaveFocus();
			expect(inputElement).toHaveValue('');
		});

		it('should show the tooltip "start search" when there is at least an item and the search is not disabled', async () => {
			useSearchStore.setState({ query: [{ id: '1', label: '1', value: '1' }] });
			const { user } = setup(<SearchBar />);
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			expect(searchButton).toBeEnabled();
			await user.hover(searchButton);
			expect(await screen.findByText('Start search')).toBeVisible();
		});

		it('should show the tooltip "type or choose..." when there is no item and the input has focus', async () => {
			useSearchStore.setState({ query: [] });
			const { user } = setup(<SearchBar />);
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			expect(searchButton).toBeDisabled();
			await user.click(screen.getByRole('textbox'));
			await user.hover(searchButton);
			expect(
				await screen.findByText('Type or choose some keywords to start a search')
			).toBeVisible();
		});

		it('should show the tooltip "type some keyword..." when there is no item and the input has not focus', async () => {
			useSearchStore.setState({ query: [] });
			const { user } = setup(<SearchBar />);
			const searchButton = screen.getByRoleWithIcon('button', { icon: SELECTORS.icons.search });
			expect(searchButton).toBeDisabled();
			await user.hover(searchButton);
			expect(await screen.findByText('Type some keywords to start a search')).toBeVisible();
		});
	});

	describe('Dropdown suggestions', () => {
		it('should render the last 5 words of the suggestion array when the user clicks on the input element', async () => {
			const mockUseLocalStorage = jest.spyOn(Shell, 'useLocalStorage');
			useSearchStore.setState({
				module: app1SearchView.route
			});
			useAppStore.getState().addSearchView(app1SearchView);
			mockUseLocalStorage.mockReturnValue([
				[
					{
						value: 'test1',
						label: 'test1',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test1'
					},
					{
						value: 'test2',
						label: 'test2',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test2'
					},
					{
						value: 'test3',
						label: 'test3',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test3'
					},
					{
						value: 'test4',
						label: 'test4',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test4'
					},
					{
						value: 'test5',
						label: 'test5',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test5'
					},
					{
						value: 'test6',
						label: 'test6',
						icon: 'ClockOutline',
						app: app2SearchView.route,
						id: 'test6'
					},
					{
						value: 'release',
						label: 'release',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'release'
					}
				],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />);
			await user.click(screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` }));
			const dropdown = await screen.findByTestId(SELECTORS.dropdown);
			expect(within(dropdown).getByText('release')).toBeVisible();
			expect(within(dropdown).queryByText('test6')).not.toBeInTheDocument();
			expect(within(dropdown).getByText('test5')).toBeVisible();
			expect(within(dropdown).getByText('test4')).toBeVisible();
			expect(within(dropdown).getByText('test3')).toBeVisible();
			expect(within(dropdown).getByText('test2')).toBeVisible();
		});

		it('should render the suggestions when the user starts typing in the input element', async () => {
			const mockUseLocalStorage = jest.spyOn(Shell, 'useLocalStorage');
			useSearchStore.setState({
				module: app1SearchView.route
			});
			useAppStore.getState().addSearchView(app1SearchView);
			mockUseLocalStorage.mockReturnValue([
				[
					{
						value: 'test',
						label: 'test',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test'
					},
					{
						value: 'test2',
						label: 'test2',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test2'
					},
					{
						value: 'test3',
						label: 'test3',
						icon: 'ClockOutline',
						app: app2SearchView.route,
						id: 'test3'
					},
					{
						value: 'release',
						label: 'release',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'release'
					}
				],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />);
			await user.type(
				screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` }),
				't'
			);
			const dropdown = await screen.findByTestId(SELECTORS.dropdown);
			expect(within(dropdown).getByText('test')).toBeVisible();
			expect(within(dropdown).getByText('test2')).toBeVisible();
			expect(within(dropdown).queryByText('test3')).not.toBeInTheDocument();
			await waitFor(() => expect(within(dropdown).queryByText('release')).not.toBeInTheDocument());
		});

		it('should create chip when the user clicks on the dropdown suggestion', async () => {
			const mockUseLocalStorage = jest.spyOn(Shell, 'useLocalStorage');
			useSearchStore.setState({
				module: app1SearchView.route
			});
			useAppStore.getState().addSearchView(app1SearchView);
			mockUseLocalStorage.mockReturnValue([
				[
					{
						value: 'test',
						label: 'test',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test'
					}
				],
				jest.fn()
			]);
			const { user } = setup(<SearchBar />);
			await user.type(
				screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` }),
				't'
			);
			const dropdown = await screen.findByTestId(SELECTORS.dropdown);
			await user.click(within(dropdown).getByText('test'));
			expect(dropdown).not.toBeInTheDocument();
			// chip is created
			expect(screen.getByText('test')).toBeVisible();
		});

		it('should not show the suggestions which label match an already existing chip', async () => {
			const mockUseLocalStorage = jest.spyOn(Shell, 'useLocalStorage');
			useSearchStore.setState({
				module: app1SearchView.route
			});
			useAppStore.getState().addSearchView(app1SearchView);
			mockUseLocalStorage.mockReturnValue([
				[
					{
						value: 'test',
						label: 'test',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test'
					},
					{
						value: 'a value for the test 2',
						label: 'test2',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test2'
					},
					{
						value: 'test2',
						label: 'test 2 with different label',
						icon: 'ClockOutline',
						app: app1SearchView.route,
						id: 'test3'
					}
				],
				jest.fn()
			]);
			useSearchStore.setState({ query: [{ id: 'chip1', label: 'chip 2 label', value: 'test2' }] });
			const { user } = setup(<SearchBar />);
			await user.type(
				screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` }),
				't'
			);
			const dropdown = screen.getByTestId(SELECTORS.dropdown);
			expect(within(dropdown).getByText('test')).toBeVisible();
			await waitFor(() => expect(within(dropdown).queryByText('test2')).not.toBeInTheDocument());
			expect(within(dropdown).getByText('test 2 with different label')).toBeVisible();
		});

		it('should store a new suggestion when a new chip is created', async () => {
			const localStorageStore: Record<string, unknown> = {};
			jest
				.spyOn(Shell, 'useLocalStorage')
				.mockImplementation(
					<T,>(key: string, initialValue: T): ReturnType<typeof Shell.useLocalStorage<T>> => {
						const updateValue = (value: T | ((prev: T) => void)): void => {
							if (value instanceof Function) {
								localStorageStore[key] = value((localStorageStore[key] as T) ?? initialValue);
							} else {
								localStorageStore[key] = value;
							}
						};
						return [(localStorageStore[key] as T) ?? initialValue, updateValue];
					}
				);

			useAppStore.getState().addSearchView(app1SearchView);
			useSearchStore.setState({
				module: app1SearchView.route
			});
			const { user } = setup(<SearchBar />);
			await user.type(
				screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` }),
				'key1'
			);
			await user.type(screen.getByRole('textbox'), ' ');
			expect(localStorageStore[LOCAL_STORAGE_SEARCH_KEY]).toContainEqual({
				value: 'key1',
				label: 'key1',
				icon: 'ClockOutline',
				app: app1SearchView.route,
				id: 'key1'
			});
			await act(async () => {
				// run dropdown update
				await jest.advanceTimersToNextTimerAsync();
			});
		});
	});

	test('should render the module selector and the input of the search bar', async () => {
		useAppStore.getState().addSearchView(app1SearchView);
		setup(<SearchBar />);
		expect(screen.getByText(app1SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
	});

	it('should show the label of the module if the user is already inside that module', () => {
		useSearchStore.setState({
			module: undefined
		});
		useAppStore.getState().addSearchView(app1SearchView);
		setup(<SearchBar />, { initialRouterEntries: [`/${app1SearchView.route}`] });
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
	});

	it('should not update module if the user navigates to a module without search', async () => {
		useAppStore.getState().addSearchView(app1SearchView);
		const { user } = setup(
			<>
				<SearchBar />
				<Link to={app2SearchView.route}>go to app2</Link>
			</>,
			{ initialRouterEntries: [`/${app1SearchView.route}`] }
		);
		await user.click(screen.getByRole('link', { name: 'go to app2' }));
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
	});

	it('should show the module with the lowest priority if both store and session storage are undefined', () => {
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
	});

	it('should show the module with the lowest priority if the session storage has an invalid value', () => {
		sessionStorage.setItem(SEARCH_MODULE_KEY, 'sasso');
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
	});

	it('should show the module matching the session storage if the module has a searchView', () => {
		sessionStorage.setItem(SEARCH_MODULE_KEY, app2SearchView.route);
		useAppStore.getState().addSearchView(app1SearchView);
		useAppStore.getState().addSearchView(app2SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app2SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app2SearchView.label}` })
		).toBeVisible();
	});

	it('should show the module with the lowest priority if the session storage module has not a searchView', () => {
		sessionStorage.setItem(SEARCH_MODULE_KEY, app2SearchView.route);
		useAppStore.getState().addSearchView(app1SearchView);
		setup(<SearchBar />);
		const selector = screen.getByTestId(SELECTORS.headerModuleSelector);
		expect(within(selector).getByText(app1SearchView.label)).toBeVisible();
		expect(
			screen.getByRole('textbox', { name: `Search in ${app1SearchView.label}` })
		).toBeVisible();
	});
});
