import { cookies } from 'next/headers';
import { ACCESS_TOKEN_KEY } from '../constants';

export async function GetAccessToken(): Promise<string> {
	'use server';
	const token = (await cookies()).get(ACCESS_TOKEN_KEY)?.value ?? '';
	return token;
}
