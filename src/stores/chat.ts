import { create } from "zustand"
import type { User } from "@/types/chat"

export const DEFAULT_AVATAR =
	"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

const DEFAULT_USER: User = {
	userId: 99999,
	user: "Roman",
	avatar: DEFAULT_AVATAR,
}

export interface ChatStore {
	user: User | null
	setUser: (name: string) => void
	clearUser: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
	user: DEFAULT_USER,
	setUser: (name) =>
		set({
			user: {
				userId: 99999,
				user: name,
				avatar: DEFAULT_AVATAR,
			},
		}),
	clearUser: () => set({ user: null }),
}))
