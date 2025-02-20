import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { useThemeStore } from "@/stores/theme"
import { ConversationList } from "@/pages/chat/conversation-list"

export function ChatPage() {
	const navigate = useNavigate()
	const { user, clearUser } = useChatStore()
	const { isDark, toggleTheme } = useThemeStore()
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
				setError(err instanceof Error ? err.message : "Failed to load conversation list")
				console.error("Failed to load conversation list:", err)
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
		<div className="flex flex-col h-screen dark:bg-gray-900">
			<header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-4xl w-full mx-auto">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold flex-shrink-0 dark:text-gray-100">Chat Room</h1>
						<div className="flex items-center gap-4">
							<span className="dark:text-gray-100">Welcome, {user?.user}!</span>
							<button
								onClick={toggleTheme}
								className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
								title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
							>
								{isDark ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5 text-gray-100"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5 text-gray-600"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
										/>
									</svg>
								)}
							</button>
							<button
								onClick={handleLogout}
								className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 rounded-md"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-hidden p-4">
				<div className="max-w-4xl w-full mx-auto  rounded-lg bg-white dark:bg-gray-900 shadow-sm h-[calc(100vh-8rem)]">
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
								<span>Loading...</span>
							</div>
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-center h-[50vh] gap-4">
							<p className="text-red-500">{error}</p>
							<button
								onClick={() => fetchConversations()}
								className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
							>
								Retry
							</button>
						</div>
					) : (
						<ConversationList />
					)}
				</div>
			</main>
		</div>
	)
}
