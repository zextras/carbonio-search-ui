/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SearchView } from './app-store';
import { useAppStore } from './app-store';
import { app1SearchView, app2SearchView } from '../mocks/utils';

describe('AppStore', () => {
	describe('addSearchView', () => {
		it('should add a view ordered based on the position', () => {
			useAppStore.getState().addSearchView(app2SearchView);
			useAppStore.getState().addSearchView(app1SearchView);
			const app3SearchView = {
				app: 'app3.app',
				icon: 'Activity',
				id: 'app3.id',
				label: 'app3.label',
				position: 3,
				route: 'app3.route',
				component: (): string => 'app3 component'
			} satisfies SearchView;
			useAppStore.getState().addSearchView(app3SearchView);

			expect(useAppStore.getState().views).toEqual([
				app1SearchView,
				app2SearchView,
				app3SearchView
			]);
		});

		it('should not add the view if another view with the same id already exists', () => {
			useAppStore.getState().addSearchView(app1SearchView);
			useAppStore.getState().addSearchView({ ...app2SearchView, id: app1SearchView.id });
			expect(useAppStore.getState().views).toEqual([app1SearchView]);
		});
	});

	describe('removeSearchView', () => {
		it('should remove a view from its id', () => {
			useAppStore.getState().addSearchView(app1SearchView);
			useAppStore.getState().addSearchView(app2SearchView);
			useAppStore.getState().removeSearchView(app2SearchView.id);
			expect(useAppStore.getState().views).toEqual([app1SearchView]);
		});

		it('should not update the views if the given view id is not present', () => {
			useAppStore.getState().addSearchView(app1SearchView);
			useAppStore.getState().addSearchView(app2SearchView);
			useAppStore.getState().removeSearchView('other');
			expect(useAppStore.getState().views).toEqual([app1SearchView, app2SearchView]);
		});
	});
});
