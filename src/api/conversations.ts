import chatData from "@/chat_data.json"
import type { GetConversationsResponse } from "./types"
import { STORAGE_KEYS } from "./storage-keys"

export const getConversations = async (): Promise<GetConversationsResponse> => {
	// 先嘗試從 localStorage 讀取
	const cached = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
	if (cached) {
		return { data: JSON.parse(cached) }
	}

	// 如果沒有快取資料,則從 mock API 取得
	await new Promise((resolve) => setTimeout(resolve, 500))
	const conversations = chatData.conversations

	// 儲存到 localStorage
	localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))

	return { data: conversations }
}
