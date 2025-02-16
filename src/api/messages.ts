import chatData from "@/chat_data.json"
import type { Message } from "@/types/chat"
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

	// 從 localStorage 讀取現有訊息
	const cached = localStorage.getItem(STORAGE_KEYS.MESSAGES)
	const messages = cached ? JSON.parse(cached) : []

	// 加入新訊息
	messages.push(newMessage)

	// 更新 localStorage
	localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))

	return { data: newMessage }
}
