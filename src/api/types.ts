import type { Conversation, Message } from "@/types/chat"

export interface APIResponse<T> {
	data: T
	error?: string
}

export type GetConversationsResponse = APIResponse<Conversation[]>
export type GetMessagesResponse = APIResponse<Message[]>
export type CreateMessageResponse = APIResponse<Message>
