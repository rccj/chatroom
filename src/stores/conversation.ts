import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Conversation, Message } from "@/types/chat"
import { getConversations, getMessages } from "@/api"

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
	clearAll: () => void
}

export const useConversationStore = create<ConversationStore>()(
	persist(
		(set) => ({
			messages: {},
			conversations: [],
			currentConversation: null,

			setCurrentConversation: (id) => set({ currentConversation: id }),

			addMessage: (conversationId, message) =>
				set((state) => {
					// 更新訊息列表
					const conversationMessages = state.messages[conversationId] || []
					const newMessages = {
						...state.messages,
						[conversationId]: [...conversationMessages, message],
					}
					// 更新聊天室資訊
					const updatedConversations = state.conversations.map((conv) => {
						const newParticipant = {
							userId: message.userId,
							user: message.user,
							avatar: message.avatar,
						}

						if (conv.participants.find((p) => p.userId === newParticipant.userId)) {
							return conv
						}

						if (conv.id === conversationId) {
							return {
								...conv,
								lastMessage: message.messageType === "text" ? message.message : "[圖片]",
								timestamp: message.timestamp,
								participants: conv.participants.find((p) => p.userId === newParticipant.userId)
									? conv.participants
									: [newParticipant, ...conv.participants],
							}
						}
						return conv
					})

					return {
						messages: newMessages,
						conversations: updatedConversations,
					}
				}),

			addReaction: (timestamp, type) =>
				set((state) => {
					const messages = { ...state.messages }
					for (const conversationId in messages) {
						messages[conversationId] = messages[conversationId].map((msg) => {
							if (msg.timestamp === timestamp) {
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
					}
					return { messages }
				}),

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

			clearAll: () => {
				set({
					conversations: [],
					currentConversation: null,
					messages: {},
				})
			},
		}),
		{
			name: "chat-storage",
			partialize: (state) => ({
				conversations: state.conversations,
				messages: state.messages,
			}),
		},
	),
)
