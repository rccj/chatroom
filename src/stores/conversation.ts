import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Conversation, Message } from "@/types/chat"
import { getConversations, getMessages } from "@/api"
import { STORAGE_KEYS } from "@/api/storage-keys"

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
			conversations: [],
			currentConversation: null,
			messages: {},

			setCurrentConversation: (id) => set({ currentConversation: id }),

			addMessage: (conversationId, message) =>
				set((state) => {
					// 更新訊息列表
					const newMessages = {
						...state.messages,
						[conversationId]: [...(state.messages[conversationId] || []), message],
					}

					// 更新對話列表
					const updatedConversations = state.conversations.map((item) =>
						item.id === conversationId
							? {
									...item,
									lastMessage: message.message,
									timestamp: message.timestamp,
									participants:
										item.participants[0].userId === message.userId
											? [
													{
														userId: message.userId,
														user: message.user,
														avatar: message.avatar,
													},
													item.participants[1],
												]
											: [
													{
														userId: message.userId,
														user: message.user,
														avatar: message.avatar,
													},
													item.participants[0],
												],
								}
							: item,
					)

					// 重新排序對話列表
					const sortedConversations = [...updatedConversations].sort((a, b) => b.timestamp - a.timestamp)
					localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations))

					return {
						messages: newMessages,
						conversations: sortedConversations,
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
			name: "chat-storage", // localStorage 的 key
			partialize: (state) => ({
				// 只持久化這些資料
				conversations: state.conversations,
				messages: state.messages,
			}),
		},
	),
)
