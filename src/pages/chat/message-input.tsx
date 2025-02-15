import { useState } from "react"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"

interface MessageInputProps {
	conversationId: number
}

export function MessageInput({ conversationId }: MessageInputProps) {
	const [message, setMessage] = useState("")
	const { user } = useChatStore()
	const { addMessage } = useConversationStore()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!message.trim() || !user) return

		addMessage(conversationId, {
			conversationId,
			userId: Number(user.id),
			user: user.name,
			avatar: `https://i.pravatar.cc/150?img=${user.id}`,
			messageType: "text",
			message: message.trim(),
			timestamp: Date.now(),
		})

		setMessage("")
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="輸入訊息..."
				className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				disabled={!message.trim()}
				className="px-4 py-2 text-white bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
			>
				發送
			</button>
		</form>
	)
}
