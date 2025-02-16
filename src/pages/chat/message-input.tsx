import { useState } from "react"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { createMessage } from "@/api/messages"

interface MessageInputProps {
	conversationId: number
}

export function MessageInput({ conversationId }: MessageInputProps) {
	const [message, setMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { user } = useChatStore()
	const { addMessage } = useConversationStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!message.trim() || !user) return

		setIsLoading(true)
		setError(null)

		try {
			const newMessage = {
				conversationId,
				userId: Number(user.id),
				user: user.name,
				avatar: `https://i.pravatar.cc/150?img=${user.id}`,
				messageType: "text" as const,
				message: message.trim(),
				timestamp: Date.now(),
			}

			const response = await createMessage(newMessage)
			addMessage(conversationId, response.data)
			setMessage("")
		} catch (err) {
			setError(err instanceof Error ? err.message : "發送訊息失敗")
			console.error("發送訊息失敗:", err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-2">
			{error && <p className="text-sm text-red-500">{error}</p>}
			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="輸入訊息..."
					disabled={isLoading}
					className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				<button
					type="submit"
					disabled={!message.trim() || isLoading}
					className="px-4 py-2 text-white bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<span className="flex items-center gap-2">
							<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							發送中...
						</span>
					) : (
						"發送"
					)}
				</button>
			</form>
		</div>
	)
}
