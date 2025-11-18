/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { ResultsHeader } from './results-header';
import { RESULT_LABEL_TYPE } from '../constants';
import { useSearchStore } from '../stores/search-store';
import { SELECTORS } from '../tests/constants';
import { screen, setup } from '../tests/utils';

describe('Results Header', () => {
	it('should show the label', () => {
		setup(<ResultsHeader label={'Test'} />);
		expect(screen.getByText('Test')).toBeVisible();
	});

	it('should an alert icon if the label type is of type warning', () => {
		setup(<ResultsHeader label={'Test'} labelType={RESULT_LABEL_TYPE.warning} />);
		expect(screen.getByTestId(`icon: ${SELECTORS.icons.resultsWarning}`)).toBeVisible();
	});

	it('should an error icon if the label type is of type warning', () => {
		setup(<ResultsHeader label={'Test'} labelType={RESULT_LABEL_TYPE.error} />);
		expect(screen.getByTestId(`icon: ${SELECTORS.icons.resultsError}`)).toBeVisible();
	});

	it('should not display any icon if the label type is of type normal', () => {
		setup(<ResultsHeader label={'Test'} labelType={RESULT_LABEL_TYPE.normal} />);
		expect(screen.queryByTestId(/icon:/)).not.toBeInTheDocument();
	});

	it('should show the chips of the query', () => {
		useSearchStore.setState({
			query: [
				{
					id: 'chip1',
					label: 'Chip 1',
					avatarIcon: 'PeopleOutline',
					value: 'value 1'
				},
				{
					id: 'chip2',
					label: 'Chip 2',
					avatarIcon: 'ActivityOutline',
					value: 'value 2'
				}
			]
		});
		setup(<ResultsHeader label={'Test'} />);
		expect(screen.getAllByTestId(SELECTORS.chip)).toHaveLength(2);
		expect(screen.getByText('Chip 1')).toBeVisible();
		expect(screen.getByTestId('icon: PeopleOutline')).toBeVisible();
		expect(screen.getByText('Chip 2')).toBeVisible();
		expect(screen.getByTestId('icon: ActivityOutline')).toBeVisible();
	});

	it('should not show the clear search button if the query is empty', () => {
		useSearchStore.setState({ query: [] });
		setup(<ResultsHeader label={'Test'} />);
		expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
	});

	it('should show the clear search button if there is at least one query item', () => {
		useSearchStore.setState({ query: [{ id: 'item 1', label: 'Item 1' }] });
		setup(<ResultsHeader label={'Test'} />);
		expect(screen.getByRole('button', { name: /clear search/i })).toBeVisible();
	});

	it('should empty the query and hide the clear button when clear search is clicked', async () => {
		useSearchStore.setState({ query: [{ id: 'item 1', label: 'Item 1' }] });
		const { user } = setup(<ResultsHeader label={'Test'} />);
		await user.click(screen.getByRole('button', { name: /clear search/i }));
		expect(screen.queryByText('item 1')).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
	});
});
