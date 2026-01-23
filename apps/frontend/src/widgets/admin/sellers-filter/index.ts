'use client';

import dynamic from 'next/dynamic';


export const SellersFilter = dynamic(() =>
	import('./sellers-filter.ui').then(m => ({
		default: m.SellersFilter
	}))
);
