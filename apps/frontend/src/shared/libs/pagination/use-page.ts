import { useQueryNumber } from '~/shared/hooks';

interface UsePageArg {
	defaultPage?: number;
	per_pages: number;
}

export interface UsePageReturn {
	page: number;
	per_pages: number;
	setPage: (value: number | ((prev: number) => number)) => void;
}

export const usePage = ({
	defaultPage = 1,
	per_pages
}: UsePageArg): UsePageReturn => {
	const [page, setPage] = useQueryNumber('page', defaultPage);
	return {
		page: page ?? defaultPage,
		per_pages,
		setPage
	};
};
