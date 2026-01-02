'use client';

import React from 'react';

export const useClickAway = <T = HTMLElement>(
	callback: VoidFunction,
	ref?: React.RefObject<T>
) => {
	const internalRef = React.useRef<T>(null);
	const _ref = ref ?? internalRef;

	React.useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (
				_ref.current &&
				!(_ref.current as unknown as HTMLDivElement).contains(
					event.target as Node
				)
			) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClick);

		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, [_ref, callback]);

	return _ref;
};
