import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chat"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function HomePage() {
	const [username, setUsername] = useState("")
	const { user, setUser } = useChatStore()
	const navigate = useNavigate()

	const handleJoin = () => {
		if (!username.trim()) {
			alert("請輸入使用者名稱")
			return
		}

		setUser({
			id: crypto.randomUUID(),
			name: username.trim(),
		})

		navigate("/chat")
	}

	if (user) {
		navigate("/chat")
		return null
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-4xl font-bold">Chat Room</h1>
			<div className="flex flex-col items-center gap-4">
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="輸入使用者名稱"
					className="px-4 py-2 border rounded"
				/>
				<Button onClick={handleJoin}>加入聊天室</Button>
			</div>
		</div>
	)
}
