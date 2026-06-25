import { redirect } from "react-router";
import { userStore } from "@/stores/user-store";

export function requireRoleLoader(allowedRoles: string[]) {
	return async () => {
		const user = userStore.getState().user;

		if (!user) {
			throw redirect("/signin");
		}

		const hasAccess = user.roles?.some((role) => allowedRoles.includes(role));

		if (!hasAccess) {
			throw redirect("*");
		}

		return user;
	};
}
