import React from 'react';

import { ErrorResponse, ErrorType } from '~/shared/types/error';
import { getSplitedErrors } from '~/shared/utils/get-splited-errors';
import s from './styles.module.scss';

interface ErrorListProps {
	errors: Partial<ErrorType | ErrorResponse | null>[];
	isView?: boolean;
	className?: string;
}

export const ErrorList: React.FC<ErrorListProps> = React.memo(
	({ errors, isView, className }) => {
		const errorsList = getSplitedErrors(errors);
		if (isView && errorsList.length > 0) {
			return (
				<div className={`${s.errorContainer} ${className || ''}`}>
					{errorsList.map((error, index) => (
						<p key={`${error}-${index}`} className={s.errorMessage}>
							{error}
						</p>
					))}
				</div>
			);
		}

		return null;
	}
);

ErrorList.displayName = 'ErrorList';
