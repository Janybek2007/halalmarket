export interface ErrorResponse {
	error: string;
	detail: string;
	status: number;
	[key: string]: string | number;
}

export type ErrorType = {
	message?: string;
	error?: string | undefined;
	detail?: string | undefined;
	non_field_errors?: string[];
} | null;
