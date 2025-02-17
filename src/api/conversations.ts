import chatData from "@/chat_data.json"
import type { GetConversationsResponse } from "./types"

export const getConversations = async (): Promise<GetConversationsResponse> => {
	// 先嘗試從 localStorage 讀取
	const cached = localStorage.getItem("chat-storage")
	if (cached?.includes("conversations") && JSON.parse(cached).state?.conversations.length > 0) {
		return { data: JSON.parse(cached).state.conversations }
	}

	// 如果沒有快取資料,則從 mock API 取得
	await new Promise((resolve) => setTimeout(resolve, 500))
	const conversations = chatData.conversations

	return { data: conversations }
}
