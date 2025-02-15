import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chat"
import { useNavigate } from "react-router-dom"

export function ChatPage() {
	const { user, clearUser } = useChatStore()
	const navigate = useNavigate()

	const handleLogout = () => {
		clearUser()
		navigate("/")
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-4xl font-bold">聊天室</h1>
			<p>歡迎, {user?.name}!</p>
			<Button onClick={handleLogout} variant="outline">
				登出
			</Button>
		</div>
	)
}
