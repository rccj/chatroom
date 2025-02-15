import { create } from "zustand"

export interface User {
	id: string | number
	name: string
}

export interface ChatStore {
	user: User | null
	setUser: (user: User) => void
	clearUser: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
}))
