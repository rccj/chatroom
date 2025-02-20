import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { MessageList } from "@/pages/chat/message-list"
import { MessageInput } from "@/pages/chat/message-input"
import { getMessages } from "@/api/messages"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ChatRoomPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const conversationId = Number(id)
	const bottomRef = useRef<HTMLDivElement>(null)

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { user } = useChatStore()
	const { conversations, messages, setMessages, setCurrentConversation } = useConversationStore()

	const conversation = conversations.find((c) => c.id === conversationId)

	const fetchMessages = useCallback(async () => {
		if (!conversation) return

		setIsLoading(true)
		setError(null)

		try {
			const response = await getMessages(conversationId)
			setMessages(conversationId, response.data)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load messages")
			console.error("Failed to load messages:", err)
		} finally {
			setIsLoading(false)
		}
	}, [conversation, conversationId, setMessages])

	useEffect(() => {
		setCurrentConversation(conversationId)
		fetchMessages()
	}, [conversationId, setCurrentConversation, fetchMessages])

	if (!conversation) {
		return null
	}

	return (
		<div className="flex flex-col h-screen dark:bg-gray-900 w-full max-w-4xl mx-auto">
			<header className="h-16 flex items-center gap-4 px-4 border-b border-gray-200 dark:border-gray-700">
				<button
					onClick={() => navigate("/chat")}
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					←
				</button>

				<div className="flex items-center gap-2">
					<div className="flex -space-x-2 flex-shrink-0">
						{conversation.participants.slice(0, 2).map((participant) => (
							<Avatar
								key={participant.userId}
								src={participant.avatar}
								alt={participant.user}
								className="w-8 h-8 border-2 border-white"
							/>
						))}
						{conversation.participants.length > 2 && (
							<div className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-900 text-sm font-medium dark:text-gray-100">
								+{conversation.participants.length - 2}
							</div>
						)}
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<h2 className="font-medium truncate dark:text-gray-100">
									{conversation.participants.map((p) => p.user).join(", ")}
								</h2>
							</TooltipTrigger>
							<TooltipContent className="dark:bg-gray-800 dark:text-gray-100">
								<p>{conversation.participants.map((p) => p.user).join(", ")}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="flex flex-col items-center gap-2">
							<svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24">
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
							<span>Loading...</span>
						</div>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-full gap-4">
						<p className="text-red-500">{error}</p>
						<button
							onClick={fetchMessages}
							className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
						>
							重試
						</button>
					</div>
				) : (
					<MessageList
						messages={messages[conversationId] || []}
						currentUser={user}
						bottomRef={bottomRef as React.RefObject<HTMLDivElement>}
					/>
				)}
			</main>

			<footer className="p-4 border-t border-gray-200 dark:border-gray-700">
				<MessageInput conversationId={conversationId} bottomRef={bottomRef as React.RefObject<HTMLDivElement>} />
			</footer>
		</div>
	)
}
