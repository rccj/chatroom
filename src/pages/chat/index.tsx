import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { ConversationList } from "@/pages/chat/conversation-list"

export function ChatPage() {
	const navigate = useNavigate()
	const { user, clearUser } = useChatStore()
	const { fetchConversations, clearAll } = useConversationStore()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadConversations = async () => {
			setIsLoading(true)
			setError(null)
			try {
				await fetchConversations()
			} catch (err) {
				setError(err instanceof Error ? err.message : "載入對話列表失敗")
				console.error("載入對話列表失敗:", err)
			} finally {
				setIsLoading(false)
			}
		}

		loadConversations()
	}, [fetchConversations])

	useEffect(() => {
		// 在關閉視窗時清除資料
		const handleBeforeUnload = () => {
			clearAll()
			localStorage.clear() // 或是只清除特定的 key
		}

		window.addEventListener("beforeunload", handleBeforeUnload)
		return () => window.removeEventListener("beforeunload", handleBeforeUnload)
	}, [clearAll])

	const handleLogout = () => {
		clearUser()
		clearAll() // 登出時清除聊天資料
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
				{isLoading ? (
					<div className="flex items-center justify-center h-[50vh]">
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
							<span>載入對話列表中...</span>
						</div>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-[50vh] gap-4">
						<p className="text-red-500">{error}</p>
						<button
							onClick={() => fetchConversations()}
							className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
						>
							重試
						</button>
					</div>
				) : (
					<ConversationList />
				)}
			</main>
		</div>
	)
}
