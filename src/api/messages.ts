import chatData from "@/chat_data.json"
import type { Message } from "@/types/chat"
import type { GetMessagesResponse, CreateMessageResponse } from "./types"

export const getMessages = async (conversationId: number): Promise<GetMessagesResponse> => {
	// 先嘗試從 localStorage 讀取
	const cached = localStorage.getItem("chat-storage")
	if (cached?.includes("messages") && JSON.parse(cached).state.messages[conversationId]) {
		const messages = JSON.parse(cached).state.messages[conversationId]
		return {
			data: messages.filter((msg: Message) => msg.conversationId === conversationId),
		}
	}

	// 如果沒有快取資料,則從 mock API 取得
	await new Promise((resolve) => setTimeout(resolve, 500))
	const messages = chatData.messages.filter((msg) => msg.conversationId === conversationId).map((msg) => msg as Message)

	return { data: messages }
}

export const createMessage = async (
	message: Omit<Message, "timestamp" | "reactions">,
): Promise<CreateMessageResponse> => {
	// 模擬網路延遲
	await new Promise((resolve) => setTimeout(resolve, 200))

	const newMessage = {
		...message,
		timestamp: Date.now(),
		reactions: { like: 0, love: 0, laugh: 0 },
	}

	return { data: newMessage }
}
