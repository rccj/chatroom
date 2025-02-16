import chatData from "@/chat_data.json"
import type { GetConversationsResponse } from "./types"

export const getConversations = async (): Promise<GetConversationsResponse> => {
	await new Promise((resolve) => setTimeout(resolve, 500))
	return {
		data: chatData.conversations,
	}
}
