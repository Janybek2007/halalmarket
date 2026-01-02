'use client';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

import { ApiMedia } from '~/shared/constants';

import { Assets } from '~/shared/assets';
import { Icon } from '~/shared/ui/icon/icon.ui';
import type { ProductImagesProps } from './product-images.types';
import s from './styles.module.scss';

export const ProductImages: React.FC<ProductImagesProps> = ({
	images,
	alt,
	classNames
}) => {
	const currentImages =
		images.length == 0 ? [{ image: Assets.Placeholder, id: '' }] : images;
	const [currentIndex, setCurrentIndex] = useState(0);

	const prevImage = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentIndex(prev =>
				prev === 0 ? currentImages.length - 1 : prev - 1
			);
		},
		[currentImages.length]
	);

	const nextImage = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentIndex(prev =>
				prev === currentImages.length - 1 ? 0 : prev + 1
			);
		},
		[currentImages.length]
	);

	return (
		<div
			className={clsx(classNames?.container || s.imageContainer, s.h)}
			style={{ position: 'relative' }}
		>
			<img
				src={ApiMedia(currentImages[currentIndex].image)}
				alt={alt}
				className={classNames?.image || s.productImage}
			/>

			{currentImages.length > 1 && (
				<>
					<button
						className={`${s.scrollButton} ${s.left}`}
						onClick={prevImage}
						aria-label='Previous image'
					>
						<Icon name='lucide:chevron-left' />
					</button>

					<button
						className={`${s.scrollButton} ${s.right}`}
						onClick={nextImage}
						aria-label='Next image'
					>
						<Icon name='lucide:chevron-right' />
					</button>
				</>
			)}
		</div>
	);
};
