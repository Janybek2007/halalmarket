'use client';
import React from 'react';

export const useToggle = (init = false) => {
	const [value, setValue] = React.useState(init);

	const toggle = React.useCallback(() => setValue(prev => !prev), []);

	return [value, { toggle, set: setValue }] as const;
};
