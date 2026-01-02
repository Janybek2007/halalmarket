export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestConfig {
	url: string;
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
	query?: Record<string, string | number | boolean | null>;
	revalidate?: number;
}

export interface HttpClientConfig {
	baseURL?: string;
	credentials?: 'include' | 'same-origin' | 'omit';
	headers?: Record<string, string>;
}
