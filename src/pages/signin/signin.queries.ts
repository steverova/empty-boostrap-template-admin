import { api } from "@/libs/axios";


export type AuthUser = {
	userId: string;
	email: string;
	role: string;
	name: string | null;
	paternalLastName: string;
	maternalLastName: string;
	scope: string;
	type: string;
	isActive: boolean;
};

export const getMe = async (): Promise<AuthUser> => {
	const { data } = await api.get("/auth/me");
	return data;
};

export const signIn = async (email: string, password: string) => {
	const response = await api.post("/auth/sign-in", { email, password });
	return response;
};

export const magicSignIn = async (email: string) => {
	const response = await api.post("/auth/sign-in/magic-link", { email });
	return response;
};
