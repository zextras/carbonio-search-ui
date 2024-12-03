/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Container, Text } from '@zextras/carbonio-design-system';

export const Placeholder = (props: Record<string, unknown>): React.JSX.Element => (
	<Container mainAlignment="flex-start" crossAlignment="flex-start" padding={{ all: 'medium' }}>
		<Text weight={'bold'} size={'large'}>
			Placeholder Component
		</Text>
		<Text>Received props:</Text>
		{Object.entries(props).map(([key, prop]) => (
			<Text key={key}>{`${key}: ${prop}`}</Text>
		))}
	</Container>
);
