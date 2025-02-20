import { useState, useRef } from "react"
import { useConversationStore } from "@/stores/conversation"
import { useChatStore } from "@/stores/chat"
import { createMessage } from "@/api/messages"
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/stores/theme"
import { Input } from "@/components/ui/input"

interface MessageInputProps {
	conversationId: number
	bottomRef: React.RefObject<HTMLDivElement> | null
}

export function MessageInput({ conversationId, bottomRef }: MessageInputProps) {
	const [message, setMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { user } = useChatStore()
	const { addMessage } = useConversationStore()
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!message.trim() || !user) return
		setIsLoading(true)
		setError(null)
		try {
			const newMessage = await createMessage({
				conversationId,
				userId: user.userId,
				user: user.user,
				avatar: user.avatar,
				messageType: "text",
				message: message.trim(),
			})
			addMessage(conversationId, newMessage.data)
			setTimeout(() => {
				if (bottomRef?.current) {
					bottomRef.current.scrollIntoView({ behavior: "smooth" })
				}
			}, 0)
			setMessage("")
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send message")
			console.error("Failed to send message:", err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file || !user) return

		setIsLoading(true)
		setError(null)
		try {
			const reader = new FileReader()
			reader.onloadend = async () => {
				const base64 = reader.result as string
				const newMessage = await createMessage({
					conversationId,
					userId: user.userId,
					user: user.user,
					avatar: user.avatar,
					messageType: "image",
					message: base64,
				})
				addMessage(conversationId, newMessage.data)
				if (bottomRef?.current) {
					bottomRef.current.scrollIntoView({ behavior: "smooth" })
				}
			}
			reader.readAsDataURL(file)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to upload image")
			console.error("Failed to upload image:", err)
		} finally {
			setIsLoading(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ""
			}
		}
	}

	const onEmojiClick = (emojiObject: EmojiClickData) => {
		setMessage((prev) => prev + emojiObject.emoji)
	}

	return (
		<div className="relative px-4">
			<div className="space-y-2">
				{error && <p className="text-sm text-red-500">{error}</p>}
				<form onSubmit={handleSubmit} className="flex items-center gap-2">
					<Input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						disabled={isLoading}
						className="flex-1"
					/>
					<Button
						type="button"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						variant="ghost"
						size="icon"
						className="text-gray-500 hover:text-gray-700"
					>
						😊
					</Button>
					<input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
					<Button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						variant="ghost"
						size="icon"
						className="text-gray-500 hover:text-gray-700"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" role="status" aria-label="Loading">
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
							</span>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
								<path
									fillRule="evenodd"
									d="M1.5 9.75v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5h-21zm9.75 6a.75.75 0 01-.75.75h-3a.75.75 0 010-1.5h3a.75.75 0 01.75.75zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</Button>
					<Button
						type="submit"
						disabled={!message.trim() || isLoading}
						variant="default"
						size="icon"
						className="rounded-full"
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" role="status" aria-label="Loading">
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
							</span>
						) : (
							"Send"
						)}
					</Button>
				</form>
			</div>

			{showEmojiPicker && (
				<div className="fixed bottom-20 right-8 z-50">
					<EmojiPicker
						onEmojiClick={onEmojiClick}
						open={showEmojiPicker}
						theme={useThemeStore.getState().isDark ? Theme.DARK : Theme.LIGHT}
					/>
				</div>
			)}
		</div>
	)
}
