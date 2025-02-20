import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chat"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { DEFAULT_AVATAR } from "@/stores/chat"
import { Avatar } from "@/components/ui/avatar"

export function HomePage() {
	const [username, setUsername] = useState("Roman")
	const { user, setUser } = useChatStore()
	const navigate = useNavigate()

	useEffect(() => {
		if (user) {
			navigate("/chat")
		}
	}, [user, navigate])

	const handleJoin = () => {
		if (!username.trim()) {
			alert("請輸入使用者名稱")
			return
		}
		setUser(username.trim())
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4 dark:bg-gray-900">
			<h1 className="text-4xl font-bold dark:text-gray-100">Chat Room</h1>
			<div className="flex flex-col items-center gap-4">
				<Avatar src={DEFAULT_AVATAR} alt="預設頭像" className="w-20 h-20" />
				<input
					disabled
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="輸入使用者名稱"
					className="px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
				/>
				<Button onClick={handleJoin}>加入聊天室</Button>
			</div>
		</div>
	)
}
