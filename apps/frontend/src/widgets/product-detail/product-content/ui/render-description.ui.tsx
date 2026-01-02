'use client';
import React from 'react';
import { Styles } from '~/global';

const DESCRIPTION_LIMIT = 300;

export const RenderDescription: React.FC<{
	desc: string;
	styles: Styles;
}> = React.memo(({ desc, styles }) => {
	const [isExpanded, setIsExpanded] = React.useState(false);

	const toggleDescription = React.useCallback(
		() => setIsExpanded(prev => !prev),
		[]
	);
	const renderDescription = React.useCallback(() => {
		if (!desc) return null;

		if (isExpanded || desc.length <= DESCRIPTION_LIMIT) {
			return desc;
		}

		return desc.slice(0, DESCRIPTION_LIMIT) + '...';
	}, [isExpanded, desc]);

	return (
		<div className={styles.descriptionList}>
			{renderDescription()}
			{desc.length > DESCRIPTION_LIMIT && (
				<button
					className={styles.toggleDescription}
					onClick={toggleDescription}
				>
					{isExpanded ? 'Свернуть' : 'Читать далее'}
				</button>
			)}
		</div>
	);
});

RenderDescription.displayName = 'RenderDescription';
