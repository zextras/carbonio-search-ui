/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Button, Container, Text } from '@zextras/carbonio-design-system';
import { pushHistory } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

import { MAIN_ROUTE } from '../../constants';

const SecondaryAppView = (): React.JSX.Element => {
	const [t] = useTranslation();
	return (
		<Container
			width="fill"
			height="fill"
			padding={{ all: 'large' }}
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Text>{t('label.view', 'This is a view')}</Text>
			<Button
				label="go to main"
				onClick={(): void => {
					pushHistory({ route: MAIN_ROUTE, path: 'hello' });
				}}
			/>
		</Container>
	);
};
export default SecondaryAppView;
