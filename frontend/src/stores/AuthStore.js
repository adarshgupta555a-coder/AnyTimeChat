// AuthStore.js
import { create } from "zustand"

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (data) => {
        set({
            user: data.user,
            token: data.token,
            isAuthenticated: true
        })
    },
    logout: () =>
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        }),
}))