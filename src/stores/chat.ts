import { create } from "zustand"

interface User {
	id: string
	name: string
}

interface ChatStore {
	user: User | null
	setUser: (user: User) => void
	clearUser: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
}))
