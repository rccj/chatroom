import { create } from "zustand"
import type { Conversation, Message } from "@/types/chat"
import chatData from "@/chat_data.json"

interface ConversationStore {
	conversations: Conversation[]
	currentConversation: number | null
	messages: Record<number, Message[]>

	// Actions
	setCurrentConversation: (id: number) => void
	addMessage: (conversationId: number, message: Omit<Message, "reactions">) => void
	addReaction: (timestamp: number, type: "like" | "love" | "laugh") => void

	// API 模擬
	fetchConversations: () => Promise<void>
	fetchMessages: (conversationId: number) => Promise<void>
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
	conversations: [],
	currentConversation: null,
	messages: {},

	setCurrentConversation: (id) => set({ currentConversation: id }),

	addMessage: (conversationId, message) => {
		const messages = get().messages
		const newMessage = {
			...message,
			reactions: {
				like: 0,
				love: 0,
				laugh: 0,
			},
		}

		set({
			messages: {
				...messages,
				[conversationId]: [...(messages[conversationId] || []), newMessage],
			},
		})
	},

	addReaction: (timestampSelected, type) => {
		const messages = get().messages
		const updatedMessages = Object.entries(messages).reduce((acc, [timestamp, msgs]) => {
			const newMsgs = msgs.map((msg) => {
				if (msg.timestamp === timestampSelected) {
					return {
						...msg,
						reactions: {
							...msg.reactions,
							[type]: msg.reactions[type] + 1,
						},
					}
				}
				return msg
			})
			return { ...acc, [timestamp]: newMsgs }
		}, {})

		set({ messages: updatedMessages })
	},

	fetchConversations: async () => {
		// 模擬 API 延遲
		await new Promise((resolve) => setTimeout(resolve, 500))
		set({ conversations: chatData.conversations })
	},

	fetchMessages: async (conversationId) => {
		await new Promise((resolve) => setTimeout(resolve, 500))
		const messages = chatData.messages.filter((msg) => msg.conversationId === conversationId)
		set((state) => ({
			messages: {
				...state.messages,
				[conversationId]: messages,
			},
		}))
	},
}))
