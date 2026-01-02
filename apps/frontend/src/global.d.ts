export interface CPageProps<P = {}, SP = {}> {
	params: Promise<P>
	searchParams: Promise<SP>
}

export interface ImageItem {
	id: string | number;
	image: string;
	created_at?: string;
}

export interface SuccessResponse {
	success: boolean;
}

export interface PaginationResponse<T> {
	count: number;
	next: null | string;
	previous: null | string;
	results: T[];
}

export type BooleanString = 'true' | 'false';

export type Styles = { readonly [key: string]: string };
