/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Button, Container, useSnackbar } from '@zextras/carbonio-design-system';
import { PrimaryBarComponentProps } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

const SecondaryRouteIconView = ({
	active,
	onClick
}: PrimaryBarComponentProps): React.JSX.Element => {
	const createSnackbar = useSnackbar();
	const [t] = useTranslation();

	return (
		<Container>
			<Button
				icon="Activity"
				type="ghost"
				color={active ? 'primary' : 'text'}
				onClick={(): void => {
					createSnackbar({
						key: 'snackbar',
						replace: true,
						severity: 'info',
						label: t('label.app_clicked', 'You have clicked a button'),
						autoHideTimeout: 1000,
						hideButton: true
					});
					onClick();
				}}
			/>
		</Container>
	);
};
export default SecondaryRouteIconView;
