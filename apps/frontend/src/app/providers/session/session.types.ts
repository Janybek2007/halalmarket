import { IUser } from '~/entities/user';

export type SessionValue = {
	user: IUser | null;
	isLoading: boolean;
};
