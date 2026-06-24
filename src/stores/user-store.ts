import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserStore {
	avatar?: string;
	userId: string;
	email: string;
	name: string | null;
	paternalLastName: string;
	maternalLastName: string;
	roles: string[];
	scope: string;
	type: string;
	isActive: boolean;
}

interface AuthState {
	avatarBlobUrl: string | null
	user: UserStore | null;
	setUser: (user: UserStore | null) => void;
	clearUser: () => void;
	_hasHydrated: boolean; // ✅ Agregá esto
	setHasHydrated: (state: boolean) => void; // ✅ Agregá esto
}

export const userStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			avatarBlobUrl: null,
			_hasHydrated: false, // ✅ Agregá esto
			setHasHydrated: (state) => set({ _hasHydrated: state }), // ✅ Agregá esto

			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ user: state.user }),
			onRehydrateStorage: () => (state) => {
				// ✅ Agregá esto
				state?.setHasHydrated(true);
			},
		},
	),
);

export const selectUser = (state: AuthState) => state.user;
export const selectUserRole = (state: AuthState) => state.user?.roles;
export const selectUserScope = (state: AuthState) => state.user?.scope;
export const selectIsUserActive = (state: AuthState) =>
	Boolean(state.user?.isActive);