/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Button, Container, Padding, Text } from '@zextras/carbonio-design-system';
import { pushHistory } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Placeholder } from '../../components/placeholder';
import { SECONDARY_ROUTE } from '../../constants';

const MainAppView = (props: object): React.JSX.Element => {
	const [t] = useTranslation();
	const location = useLocation();

	return (
		<Container
			width="fill"
			height="fill"
			padding={{ all: 'large' }}
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Text>{t('label.main_view', 'This is a main view')}</Text>
			<Text>
				{t('label.current_location', 'Current location')}: {location.pathname}
			</Text>
			<Container
				padding={{ vertical: 'small' }}
				height="fit"
				orientation="horizontal"
				mainAlignment="flex-start"
				className="BYPASS"
			>
				<Padding right="small">
					<Button
						label="go to secondary"
						onClick={(): void => {
							pushHistory({ route: SECONDARY_ROUTE, path: 'hello' });
						}}
					/>
				</Padding>
			</Container>
			<Placeholder {...props} />
		</Container>
	);
};
export default MainAppView;
