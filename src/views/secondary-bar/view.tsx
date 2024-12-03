/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Button, Container, Padding, Row, Text } from '@zextras/carbonio-design-system';
import { pushHistory } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

import { Placeholder } from '../../components/placeholder';
import { MAIN_ROUTE } from '../../constants';

const SecondaryBarView = (props: object): React.JSX.Element => {
	const [t] = useTranslation();
	return (
		<Container
			padding={{ all: 'small' }}
			height="auto"
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Row>
				<Text>{t('label.secondary_bar_view', 'Secondary Bar')}</Text>
			</Row>
			<Padding bottom="small">
				<Button
					label="Main Route Hello"
					onClick={(): void => {
						pushHistory({ route: MAIN_ROUTE, path: 'hello' });
					}}
				/>
			</Padding>
			<Padding bottom="small">
				<Button
					label="Main Route World"
					onClick={(): void => {
						pushHistory({ route: MAIN_ROUTE, path: 'world' });
					}}
				/>
			</Padding>
			<Placeholder {...props} />
		</Container>
	);
};
export default SecondaryBarView;
