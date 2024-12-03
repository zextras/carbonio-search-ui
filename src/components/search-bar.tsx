/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ChipInputProps, ChipItem } from '@zextras/carbonio-design-system';
import { Button, ChipInput, Container, Tooltip } from '@zextras/carbonio-design-system';
import { pushHistory, useLocalStorage } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ModuleSelector } from './module-selector';
import { APP_ROUTE, LOCAL_STORAGE_SEARCH_KEY } from '../constants';
import { useSearchModule } from '../hooks/use-search-module';
import { useAppStore } from '../stores/app-store';
import { useSearchStore } from '../stores/search-store';
import type { QueryChip } from '../stores/search-store';

const StyledChipInput = styled(ChipInput<string>)`
	cursor: pointer;
	overflow-x: hidden;
	padding: 0 1rem;
	&:hover {
		outline: none;
		background: ${({ theme, disabled }): string =>
			disabled ? 'gray5' : theme.palette.gray5.hover};
	}
`;

const StyledContainer = styled(Container)`
	height: 2.625rem;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-0.125rem);
	}
`;

type SearchChipInputProps<K extends keyof ChipInputProps<string>> = NonNullable<
	ChipInputProps<string>[K]
>;
type SearchOption = NonNullable<ChipInputProps<string>['options']>[number] & {
	/** The route of the app which the suggestion belongs to */
	app?: string;
	value: string;
};

export const SearchBar = (): React.JSX.Element => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [t] = useTranslation();
	const [storedSuggestions, setStoredSuggestions] = useLocalStorage<SearchOption[]>(
		LOCAL_STORAGE_SEARCH_KEY,
		[]
	);
	const [inputTyped, setInputTyped] = useState<string>('');
	const [currentSearchModuleRoute] = useSearchModule();
	const { updateQuery, query, searchDisabled, setSearchDisabled, tooltip } = useSearchStore();
	const modules = useAppStore((state) => state.views);
	const moduleLabel = useMemo(
		() =>
			modules.find(({ route }) => route === currentSearchModuleRoute)?.label ??
			currentSearchModuleRoute,
		[currentSearchModuleRoute, modules]
	);

	const [isTyping, setIsTyping] = useState(false);

	const [options, setOptions] = useState<SearchOption[]>([]);

	const [inputHasFocus, setInputHasFocus] = useState(false);

	const [searchInputValue, setSearchInputValue] = useState<SearchChipInputProps<'value'>>(query);

	const showClear = useMemo(
		() =>
			searchInputValue.length > 0 || (inputRef.current?.value && inputRef.current.value.length > 0),
		[searchInputValue.length]
	);
	const clearSearch = useCallback((): void => {
		if (inputRef.current) {
			inputRef.current.value = '';
			inputRef.current?.focus();
		}
		setIsTyping(false);
		setSearchInputValue([]);
		setSearchDisabled(false);
		updateQuery([]);
		setInputTyped('');
	}, [setSearchDisabled, updateQuery]);

	const getUniqChipsByLabel = useCallback(
		(currentQuery: QueryChip[], chipsToAdd: QueryChip[]): QueryChip[] => {
			const currentQueryChips = currentQuery.filter((currentQueryChip) =>
				searchInputValue.some((searchInputChip) => searchInputChip.label === currentQueryChip.label)
			);
			return chipsToAdd.reduce((accumulator, newInputChip) => {
				if (
					!currentQuery.some((currentQueryChip) => currentQueryChip.label === newInputChip.label)
				) {
					accumulator.push(newInputChip);
				}
				return accumulator;
			}, currentQueryChips);
		},
		[searchInputValue]
	);

	const onSearch = useCallback(() => {
		updateQuery((currentQuery) => {
			const inputElement = inputRef?.current;
			if (inputElement) {
				inputElement.value = '';
			}

			if (inputTyped.length > 0) {
				const newInputValue: typeof searchInputValue = [
					...searchInputValue,
					...inputTyped.split(' ').map(
						(label, id): QueryChip => ({
							id: `${id}`,
							label,
							hasAvatar: false
						})
					)
				];

				setSearchInputValue(newInputValue);
				setInputTyped('');
				return getUniqChipsByLabel(currentQuery, newInputValue);
			}

			setInputTyped('');

			return getUniqChipsByLabel(currentQuery, searchInputValue);
		});
		// TODO: perform a navigation only when coming from a different module (not the search one)
		pushHistory({
			route: APP_ROUTE,
			path: ''
		});
	}, [getUniqChipsByLabel, inputTyped, searchInputValue, updateQuery]);

	const appSuggestions = useMemo<SearchOption[]>(
		() =>
			storedSuggestions
				.filter((searchOption) => searchOption.app === currentSearchModuleRoute)
				.reverse()
				.map(
					(item): SearchOption => ({
						...item,
						disabled: searchDisabled,
						onClick: (): void => {
							const newInputChip = {
								...item, // FIXME: dropdown item fields are being passed down to chip
								hasAvatar: false,
								onClick: undefined
							} satisfies ChipItem<string>;
							setSearchInputValue((prevState) => [...prevState, newInputChip]);
						}
					})
				),
		[storedSuggestions, currentSearchModuleRoute, searchDisabled]
	);

	const updateOptions = useCallback(
		(textContent: string, queryChips: QueryChip[]): void => {
			if (textContent.length > 0) {
				setOptions(
					appSuggestions
						.filter(
							(suggestion) =>
								textContent &&
								suggestion.label?.includes(textContent) &&
								!queryChips.some((queryChip) => queryChip.value === suggestion.label)
						)
						.slice(0, 5)
				);
			} else {
				setOptions(appSuggestions.slice(0, 5));
			}
		},
		[appSuggestions]
	);

	const saveSuggestions = useCallback(
		(queryChips: QueryChip[]) => {
			const lastChipLabel = queryChips[queryChips.length - 1]?.label;
			if (
				lastChipLabel &&
				typeof lastChipLabel === 'string' &&
				currentSearchModuleRoute &&
				!appSuggestions.find((suggestion) => suggestion.label === lastChipLabel)
			) {
				setStoredSuggestions((prevState) => {
					const newSuggestion: SearchOption = {
						value: lastChipLabel,
						label: lastChipLabel,
						icon: 'ClockOutline',
						app: currentSearchModuleRoute,
						id: lastChipLabel
					};
					return [...prevState, newSuggestion];
				});
			}
		},
		[appSuggestions, currentSearchModuleRoute, setStoredSuggestions]
	);
	const onQueryChange = useCallback<SearchChipInputProps<'onChange'>>(
		(newQuery) => {
			// FIXME: move the saving of suggestions after the search occurs.
			// 	The saving logic should not be placed here because the onChange is called even when a chip is removed from the chipInput.
			//  So, at the moment, keywords never searched for are saved too.
			saveSuggestions(newQuery);

			setSearchInputValue(newQuery);
		},
		[saveSuggestions]
	);

	const onInputType = useCallback<NonNullable<ChipInputProps<string>['onInputType']>>(
		(ev) => {
			if (!ev.textContent) {
				setIsTyping(false);
			} else {
				setIsTyping(true);
			}
			setInputTyped(ev.textContent ?? '');
			updateOptions(ev.textContent ?? '', query);
		},
		[query, updateOptions]
	);

	useEffect(() => {
		if (currentSearchModuleRoute) {
			const suggestions = appSuggestions
				.filter((suggestion) => suggestion.app === currentSearchModuleRoute)
				.slice(0, 5);

			setOptions((prevState) => {
				if (prevState.length === 0 && suggestions.length === 0) {
					return prevState;
				}
				return suggestions;
			});
		}
	}, [appSuggestions, currentSearchModuleRoute]);

	const containerRef = useRef<HTMLDivElement>(null);
	const addFocus = useCallback(() => setInputHasFocus(true), []);
	const removeFocus = useCallback(() => setInputHasFocus(false), []);

	useEffect(() => {
		const inputElement = inputRef.current;
		const runSearchOnKeyUp = (ev: KeyboardEvent): void => {
			if (ev.key === 'Enter') {
				onSearch();
				removeFocus();
			}
		};
		inputElement?.addEventListener('keyup', runSearchOnKeyUp);

		return (): void => {
			inputElement?.removeEventListener('keyup', runSearchOnKeyUp);
		};
	}, [onSearch, removeFocus]);

	const disableOptions = useMemo(() => options.length <= 0 || isTyping, [options, isTyping]);

	const placeholder = useMemo(
		() =>
			inputHasFocus && currentSearchModuleRoute
				? t('search.active_input_label', 'Separate your keywords by a comma or pressing TAB')
				: t('search.idle_input_label', 'Search in {{module}}', {
						module: moduleLabel
					}),
		[currentSearchModuleRoute, inputHasFocus, moduleLabel, t]
	);

	const clearButtonPlaceholder = useMemo(
		() =>
			showClear || isTyping
				? t('search.clear', 'Clear search input')
				: t('search.already_clear', 'Search input is already clear'),
		[showClear, t, isTyping]
	);

	const searchButtonsAreDisabled = useMemo(
		() => (isTyping ? false : !showClear),
		[showClear, isTyping]
	);

	const searchBtnTooltipLabel = useMemo(() => {
		if (!searchButtonsAreDisabled && searchInputValue.length > 0) {
			return t('search.start', 'Start search');
		}
		if (inputHasFocus) {
			return t(
				'search.type_or_choose_suggestion',
				'Type or choose some keywords to start a search'
			);
		}
		// TODO: I don't know if this branch makes sense. How can it be reached?
		//    searchInputValue is derived from query, and searchButtonsAreDisabled is true only if searchInputValue is empty,
		//    aka query is empty. I'm leaving it here for now, but I think it could be removed
		if (query.length > 0) {
			return t('label.edit_to_start_search', 'Edit your search to start a new one');
		}
		return t('search.type_to_start_search', 'Type some keywords to start a search');
	}, [searchButtonsAreDisabled, searchInputValue.length, inputHasFocus, query.length, t]);

	const onChipAdd = useCallback<SearchChipInputProps<'onAdd'>>(
		(newChip) => {
			setIsTyping(false);
			setInputTyped('');
			if (currentSearchModuleRoute) {
				const suggestions = appSuggestions
					.filter((suggestion) => suggestion?.app === currentSearchModuleRoute)
					.slice(0, 5);

				setOptions(suggestions);
			}
			return {
				label: typeof newChip === 'string' ? newChip : '',
				value: newChip as string,
				hasAvatar: false
			};
		},
		[appSuggestions, currentSearchModuleRoute]
	);

	useEffect(() => {
		setSearchInputValue(query.map((queryChip) => ({ ...queryChip, disabled: searchDisabled })));
	}, [searchDisabled, query]);

	return (
		<Container
			width="fit"
			flexGrow="1"
			orientation="horizontal"
			ref={containerRef}
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Tooltip
				disabled={!searchDisabled}
				maxWidth="100%"
				label={
					tooltip ??
					t('search.unable_to_parse_query', 'Unable to complete the search, clear it and retry')
				}
			>
				<Container
					orientation="horizontal"
					width="fill"
					maxWidth={'53vw'}
					minWidth={'32rem'}
					gap={'0.5rem'}
				>
					<Container minWidth="20rem" width="fill">
						<Container orientation="horizontal" width="fill">
							<Container width="fit">
								<ModuleSelector />
							</Container>
							<StyledContainer orientation="horizontal">
								<StyledChipInput
									disabled={searchDisabled}
									inputRef={inputRef}
									value={searchInputValue}
									onAdd={onChipAdd}
									options={options}
									placeholder={placeholder}
									confirmChipOnBlur={false}
									separators={[
										{ key: 'Enter', ctrlKey: false },
										{ key: ',', ctrlKey: false },
										{ key: ' ', ctrlKey: false }
									]}
									background={searchDisabled ? 'gray5' : 'gray6'}
									onChange={onQueryChange}
									onInputType={onInputType}
									onInputTypeDebounce={0}
									onBlur={removeFocus}
									onFocus={addFocus}
									disableOptions={disableOptions}
									requireUniqueChips={false}
									wrap={'nowrap'}
								/>
							</StyledContainer>
						</Container>
					</Container>

					{!searchButtonsAreDisabled && (
						<Tooltip label={clearButtonPlaceholder} placement="bottom">
							<Button
								size="large"
								type="outlined"
								disabled={searchButtonsAreDisabled}
								icon="BackspaceOutline"
								color="primary"
								onClick={clearSearch}
							/>
						</Tooltip>
					)}

					<Tooltip
						maxWidth="100%"
						disabled={searchDisabled}
						label={searchBtnTooltipLabel}
						placement="bottom"
					>
						<Button
							size="large"
							icon="Search"
							disabled={searchButtonsAreDisabled}
							color="primary"
							onClick={onSearch}
						/>
					</Tooltip>
				</Container>
			</Tooltip>
		</Container>
	);
};
