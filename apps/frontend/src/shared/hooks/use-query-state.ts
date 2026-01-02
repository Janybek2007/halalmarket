'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type Parser<T> = {
	serialize: (value: T) => string;
	deserialize: (value: string) => T;
};

const defaultParser = {
	string: {
		serialize: (value: string) => value,
		deserialize: (value: string) => value
	},
	number: {
		serialize: (value: number) => value.toString(),
		deserialize: (value: string) => {
			const num = Number(value);
			return isNaN(num) ? 0 : num;
		}
	},
	boolean: {
		serialize: (value: boolean) => (value ? 'true' : 'false'),
		deserialize: (value: string) => value === 'true'
	},
	json: <T>(): Parser<T> => ({
		serialize: (value: T) => JSON.stringify(value),
		deserialize: (value: string) => {
			try {
				return JSON.parse(value) as T;
			} catch {
				return {} as T;
			}
		}
	}),
	// Новый парсер для enum
	enum: <T extends string | number>(values: readonly T[]): Parser<T> => ({
		serialize: (value: T) => value.toString(),
		deserialize: (value: string): T => {
			const parsed = values.find(v => v.toString() === value) as T | undefined;
			return parsed ?? (values[0] as T); // fallback на первое значение enum'а
		}
	})
};

export function useQueryState<T>(
	key: string,
	initialValue: T,
	parser?: Parser<T>
): [T, (value: T | ((prev: T) => T)) => void] {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const activeParser: Parser<T> =
		parser ??
		(defaultParser as any)[typeof initialValue] ??
		defaultParser.string;

	const value = useMemo(() => {
		const param = searchParams.get(key);
		if (param === null) return initialValue;
		return activeParser.deserialize(param);
	}, [searchParams, key, initialValue, activeParser]);

	const setValue = useCallback(
		(newValue: T | ((prev: T) => T)) => {
			const currentValue =
				typeof newValue === 'function'
					? (newValue as (prev: T) => T)(value)
					: newValue;

			const current = new URLSearchParams(Array.from(searchParams.entries()));

			if (
				currentValue === initialValue ||
				currentValue === undefined ||
				currentValue === null ||
				(typeof currentValue === 'string' && currentValue.trim() === '')
			) {
				current.delete(key);
			} else {
				current.set(key, activeParser.serialize(currentValue));
			}

			const query = current.toString();
			const url = query ? `${pathname}?${query}` : pathname;

			router.push(url, { scroll: false });
		},
		[key, initialValue, activeParser, pathname, router, searchParams, value]
	);

	return [value, setValue];
}


export const useQueryString = (key: string, initialValue = '') =>
	useQueryState(key, initialValue, defaultParser.string);

export const useQueryNumber = (key: string, initialValue = 0) =>
	useQueryState(key, initialValue, defaultParser.number);

export const useQueryBoolean = (key: string, initialValue = false) =>
	useQueryState(key, initialValue, defaultParser.boolean);

export const useQueryJson = <T>(key: string, initialValue: T) =>
	useQueryState(key, initialValue, defaultParser.json<T>());

export const useQueryEnum = <T extends string | number>(
	key: string,
	values: readonly T[],
	initialValue: T
) => useQueryState(key, initialValue, defaultParser.enum(values));
