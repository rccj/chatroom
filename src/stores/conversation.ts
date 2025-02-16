import { create } from "zustand"
import type { Conversation, Message } from "@/types/chat"
import { getConversations } from "@/api/conversations"
import { getMessages } from "@/api/messages"

interface ConversationStore {
	conversations: Conversation[]
	currentConversation: number | null
	messages: Record<number, Message[]>

	// Actions
	setCurrentConversation: (id: number) => void
	addMessage: (conversationId: number, message: Message) => void
	addReaction: (timestamp: number, type: "like" | "love" | "laugh") => void
	setMessages: (conversationId: number, messages: Message[]) => void

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
		set({
			messages: {
				...messages,
				[conversationId]: [...(messages[conversationId] || []), message],
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

	setMessages: (conversationId, messages) =>
		set((state) => ({
			messages: {
				...state.messages,
				[conversationId]: messages,
			},
		})),

	fetchConversations: async () => {
		const response = await getConversations()
		set({ conversations: response.data })
	},

	fetchMessages: async (conversationId) => {
		const response = await getMessages(conversationId)
		set((state) => ({
			messages: {
				...state.messages,
				[conversationId]: response.data,
			},
		}))
	},
}))
