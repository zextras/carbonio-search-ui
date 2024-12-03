/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react';

import {
	Button,
	Chip,
	Container,
	Divider,
	Icon,
	Padding,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { RESULT_LABEL_TYPE } from '../constants';
import { useDisableSearch, useQuery } from '../hooks/hooks';
import type { ValueOf } from '../types/utils';

const getIconAndColor = (
	labelType: ValueOf<typeof RESULT_LABEL_TYPE>
): [icon: string, color: string] => {
	if (labelType === RESULT_LABEL_TYPE.warning) {
		return ['AlertTriangle', 'warning'];
	}
	if (labelType === RESULT_LABEL_TYPE.error) {
		return ['CloseSquare', 'error'];
	}
	return ['', ''];
};

export type ResultsHeaderProps = {
	label: string;
	labelType?: ValueOf<typeof RESULT_LABEL_TYPE>;
};

export const ResultsHeader = ({
	label,
	labelType = RESULT_LABEL_TYPE.normal
}: ResultsHeaderProps): React.JSX.Element => {
	const [t] = useTranslation();
	const [query, updateQuery] = useQuery();
	const [, setDisabled] = useDisableSearch();

	const resetQuery = useCallback(() => {
		updateQuery([]);
		setDisabled(false);
	}, [updateQuery, setDisabled]);

	const [icon, color] = getIconAndColor(labelType);

	const chipItems = useMemo(
		() =>
			query.map((queryChip) => (
				<Padding key={queryChip.id} all="extrasmall">
					<Chip {...queryChip} background={'gray2'} />
				</Padding>
			)),
		[query]
	);

	return (
		<>
			<Container
				orientation="horizontal"
				mainAlignment="flex-start"
				width="100%"
				background={'gray5'}
				height="fit"
				minHeight="3rem"
				maxHeight="7.5rem"
				style={{ overflow: 'hidden' }}
				padding={{ horizontal: 'large', vertical: 'medium' }}
			>
				<Container width="85%" orientation="horizontal" wrap="wrap" mainAlignment="flex-start">
					{labelType !== RESULT_LABEL_TYPE.normal && (
						<Padding right="small">
							<Icon icon={icon} size="large" color={color} />
						</Padding>
					)}
					<Text color="secondary">{label}</Text>
					{chipItems}
				</Container>
				{query.length > 0 && (
					<Container width="15%" mainAlignment="flex-start" crossAlignment="flex-start">
						<Button
							label={t('label.clear_search_query', 'Clear search')}
							icon="CloseOutline"
							color="primary"
							width="fill"
							type="ghost"
							onClick={resetQuery}
						/>
					</Container>
				)}
			</Container>
			<Divider color="gray3" />
		</>
	);
};
