import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { ConversationList } from "@/pages/chat/conversation-list"

export function ChatPage() {
	const navigate = useNavigate()
	const { user, clearUser } = useChatStore()
	const { fetchConversations } = useConversationStore()

	useEffect(() => {
		fetchConversations()
	}, [fetchConversations])

	const handleLogout = () => {
		clearUser()
		navigate("/")
	}

	return (
		<div className="flex flex-col h-screen">
			<header className="flex items-center justify-between p-4 border-b">
				<h1 className="text-xl font-bold">聊天室</h1>
				<div className="flex items-center gap-4">
					<span>歡迎, {user?.name}!</span>
					<button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
						登出
					</button>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto">
				<ConversationList />
			</main>
		</div>
	)
}
