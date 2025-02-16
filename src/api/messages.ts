import chatData from "@/chat_data.json"
import type { Message, Conversation, User } from "@/types/chat"
import type { GetMessagesResponse, CreateMessageResponse } from "./types"
import { STORAGE_KEYS } from "./storage-keys"

export const getMessages = async (conversationId: number): Promise<GetMessagesResponse> => {
	// 先嘗試從 localStorage 讀取
	const cached = localStorage.getItem(STORAGE_KEYS.MESSAGES)
	if (cached) {
		const messages = JSON.parse(cached)
		return {
			data: messages.filter((msg: Message) => msg.conversationId === conversationId),
		}
	}

	// 如果沒有快取資料,則從 mock API 取得
	await new Promise((resolve) => setTimeout(resolve, 500))
	const messages = chatData.messages.filter((msg) => msg.conversationId === conversationId).map((msg) => msg as Message)

	// 儲存到 localStorage
	localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatData.messages))

	return { data: messages }
}

export const createMessage = async (message: Omit<Message, "reactions">): Promise<CreateMessageResponse> => {
	await new Promise((resolve) => setTimeout(resolve, 500))

	const newMessage = {
		...message,
		reactions: {
			like: 0,
			love: 0,
			laugh: 0,
		},
	}

	// 從 localStorage 讀取現有訊息和對話
	const cachedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
	const cachedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
	const messages = cachedMessages ? JSON.parse(cachedMessages) : []
	const conversations = cachedConversations ? JSON.parse(cachedConversations) : []

	// 加入新訊息
	messages.push(newMessage)

	// 更新對話的最後訊息和時間
	const updatedConversations = conversations.map((item: Conversation) =>
		item.id === message.conversationId
			? {
					...item,
					lastMessage: message.message,
					timestamp: message.timestamp,
					participants: item.participants.map((p: User) =>
						p.userId === message.userId ? { ...p, user: message.user, avatar: message.avatar } : p,
					),
				}
			: item,
	)

	// 根據時間戳重新排序對話
	const sortedConversations = [...updatedConversations].sort((a, b) => b.timestamp - a.timestamp)

	// 更新 localStorage
	localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
	localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations))

	return { data: newMessage }
}
