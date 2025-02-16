import chatData from "@/chat_data.json"
import type { Message } from "@/types/chat"
import type { GetMessagesResponse, CreateMessageResponse } from "./types"

export const getMessages = async (conversationId: number): Promise<GetMessagesResponse> => {
	await new Promise((resolve) => setTimeout(resolve, 500))
	const messages = chatData.messages.filter((msg) => msg.conversationId === conversationId).map((msg) => msg as Message)
	return {
		data: messages,
	}
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
	return {
		data: newMessage,
	}
}
