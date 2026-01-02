import qs from 'qs';
import { HttpClientConfig, HttpRequestConfig } from './http.types';

export class HttpClient {
	private config: HttpClientConfig = {};

	constructor(config: HttpClientConfig = {}) {
		this.config = config;
	}

	private buildUrl(url: string, query?: Record<string, any>): string {
		const base = this.config.baseURL ?? '';
		const fullUrl = `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
		if (!query) return fullUrl;

		const cleanedQuery = Object.fromEntries(
			Object.entries(query).filter(
				([_, v]) => v !== null && v !== undefined && v !== ''
			)
		);

		const queryString = qs.stringify(cleanedQuery, {
			arrayFormat: 'brackets',
			encode: true,
			allowDots: true,
			skipNulls: true
		});
		return queryString ? `${fullUrl}?${queryString}` : fullUrl;
	}

	private prepareBodyAndHeaders(
		body: unknown,
		method: string,
		headers: Record<string, string>
	): { body?: BodyInit; headers: Record<string, string> } {
		if (!body || method === 'GET' || method === 'HEAD') {
			return { headers };
		}

		const hasContentType = headers['Content-Type'] || headers['content-type'];
		const normalizedHeaders = { ...headers };

		if (!hasContentType) {
			if (
				typeof body === 'object' &&
				body !== null &&
				!(body instanceof FormData) &&
				!(body instanceof URLSearchParams) &&
				!(body instanceof Blob) &&
				!(body instanceof ArrayBuffer) &&
				!ArrayBuffer.isView(body)
			) {
				normalizedHeaders['Content-Type'] = 'application/json';
				return {
					body: JSON.stringify(body),
					headers: normalizedHeaders
				};
			}

			return {
				body: body as BodyInit,
				headers: normalizedHeaders
			};
		}

		const contentType = hasContentType.toLowerCase();

		if (contentType.includes('application/json')) {
			if (
				typeof body === 'object' &&
				body !== null &&
				!(body instanceof FormData) &&
				!(body instanceof URLSearchParams)
			) {
				return {
					body: JSON.stringify(body),
					headers: normalizedHeaders
				};
			}
		}

		return {
			body: body as BodyInit,
			headers: normalizedHeaders
		};
	}

	private async request<T>(config: HttpRequestConfig): Promise<T> {
		const { url, method = 'GET', body, query } = config;

		const requestUrl = this.buildUrl(url, query);

		const baseHeaders: Record<string, string> = {
			...(this.config.headers || {}),
			...(config.headers || {})
		};

		const { body: preparedBody, headers: finalHeaders } =
			this.prepareBodyAndHeaders(body, method, baseHeaders);

		const fetchConfig: RequestInit = {
			method,
			headers: finalHeaders,
			...(preparedBody !== undefined && { body: preparedBody })
		};

		if (this.config.credentials) {
			fetchConfig.credentials = this.config.credentials;
		}

		if (config.revalidate) {
			if (config.revalidate) {
				fetchConfig.next = { revalidate: config.revalidate };
			}
		}

		const response = await fetch(requestUrl, fetchConfig);

		let data: any;
		const contentType = response.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (!response.ok) {
			throw {
				status: response.status,
				...data
			};
		}

		return data as T;
	}

	get<T>(
		url: string,
		config?: Omit<HttpRequestConfig, 'url' | 'body' | 'method'>
	): Promise<T> {
		return this.request<T>({ url, method: 'GET', ...config });
	}

	post<T>(
		url: string,
		body?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'body' | 'method'>
	): Promise<T> {
		return this.request<T>({ url, method: 'POST', body, ...config });
	}

	put<T>(
		url: string,
		body?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'body' | 'method'>
	): Promise<T> {
		return this.request<T>({ url, method: 'PUT', body, ...config });
	}

	patch<T>(
		url: string,
		body?: unknown,
		config?: Omit<HttpRequestConfig, 'url' | 'body' | 'method'>
	): Promise<T> {
		return this.request<T>({ url, method: 'PATCH', body, ...config });
	}

	delete<T>(
		url: string,
		config?: Omit<HttpRequestConfig, 'url' | 'method'>
	): Promise<T> {
		return this.request<T>({ url, method: 'DELETE', ...config });
	}
}
