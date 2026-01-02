export type AuthResponse = {
	user_id: number;
	tokens: {
		access: string;
		refresh: string;
	};
};
