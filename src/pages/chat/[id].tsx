import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { MessageList } from "@/pages/chat/message-list"
import { MessageInput } from "@/pages/chat/message-input"

export function ChatRoomPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const conversationId = Number(id)

	const { user } = useChatStore()
	const { conversations, messages, fetchMessages, setCurrentConversation } = useConversationStore()

	const conversation = conversations.find((c) => c.id === conversationId)

	useEffect(() => {
		if (!conversation) return
		setCurrentConversation(conversationId)
		fetchMessages(conversationId)
	}, [conversation, conversationId, fetchMessages, setCurrentConversation])

	if (!conversation) {
		return null
	}

	return (
		<div className="flex flex-col h-screen">
			<header className="flex items-center gap-4 p-4 border-b">
				<button onClick={() => navigate("/chat")} className="text-gray-500 hover:text-gray-700">
					←
				</button>

				<div className="flex items-center gap-2">
					{conversation.participants.map((participant) => (
						<img
							key={participant.userId}
							src={participant.avatar}
							alt={participant.user}
							className="w-8 h-8 rounded-full"
						/>
					))}
					<h2 className="font-medium">{conversation.participants.map((p) => p.user).join(", ")}</h2>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto p-4">
				<MessageList messages={messages[conversationId] || []} currentUser={user} />
			</main>

			<footer className="p-4 border-t">
				<MessageInput conversationId={conversationId} />
			</footer>
		</div>
	)
}
