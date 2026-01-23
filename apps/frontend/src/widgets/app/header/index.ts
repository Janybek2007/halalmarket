'use client';
import dynamic from 'next/dynamic';

export const AppHeader = dynamic(() => import('./header.ui'));
