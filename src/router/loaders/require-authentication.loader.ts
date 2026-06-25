import { redirect } from "react-router";
import { api } from "@/libs/axios";
import { userStore } from "@/stores/user-store";

export async function requireAuthLoader() {
	try {
		const response = await api.get("/auth/me");

		userStore.getState().setUser(response.data.user);

		return response.data;
	} catch (error: any) {
		const status = error.response?.status;

		if (status >= 500 || status === undefined) {
			return redirect("/server-error");
		}

		localStorage.clear();
		return redirect("/signin");
	}
}
