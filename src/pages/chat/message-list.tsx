import { useMemo, useEffect, useRef, useState } from "react"
import type { Message, User } from "@/types/chat"
import { formatMessageDate, formatMessageTime } from "@/utils/date"
import { useConversationStore } from "@/stores/conversation"
import clsx from "clsx"
import { useLongPress } from "@/hooks/use-long-press"
import EmojiPicker from "emoji-picker-react"

const SystemMessage = ({ message }: { message: string }) => (
	<div className="flex justify-center">
		<span className="px-4 py-2 text-sm text-gray-500 bg-gray-50 rounded-full">{message}</span>
	</div>
)

const ImageMessage = ({ src }: { src: string }) => <img src={src} alt="圖片訊息" className="max-w-[300px] rounded-lg" />

const TextMessage = ({ message }: { message: string }) => <p className="break-words">{message}</p>

type EmojiKeyType = "like" | "love" | "laugh"
type EmojiMap = {
	[key: string]: EmojiKeyType
}

const emojiMap: EmojiMap = {
	"1f44d": "like",
	"2764-fe0f": "love",
	"1f604": "laugh",
}

interface MessageListProps {
	messages: Message[]
	currentUser: User | null
	bottomRef: React.RefObject<HTMLDivElement> | null
}

interface MessageProps {
	message: Message
	currentUser: User | null
	onLongPress: (e: React.MouseEvent | React.TouchEvent, timestamp: number) => void
	onClick: () => void
	addReaction: (timestamp: number, type: "like" | "love" | "laugh") => void
}

const Message = ({ message, currentUser, onLongPress, onClick, addReaction }: MessageProps) => {
	const longPressProps = useLongPress({
		onLongPress: (e) => onLongPress(e, message.timestamp),
		onClick,
	})

	return (
		<div
			{...longPressProps}
			className={clsx("flex gap-4", {
				"flex-row-reverse": message.userId === currentUser?.userId,
			})}
		>
			<img src={message.avatar} alt={message.user} className="w-8 h-8 rounded-full" />

			<div className="flex flex-col max-w-[70%]">
				<div className="flex items-center gap-2 mb-1">
					<span className="font-medium">{message.user}</span>
					<span className="text-sm text-gray-500">{formatMessageTime(message.timestamp)}</span>
				</div>

				<div
					className={`p-3 rounded-lg ${
						message.userId === currentUser?.userId ? "bg-blue-500 text-white" : "bg-gray-100"
					}`}
				>
					{message.messageType === "text" && <TextMessage message={message.message} />}
					{message.messageType === "image" && <ImageMessage src={message.message} />}
				</div>

				{(message.reactions.like > 0 || message.reactions.love > 0 || message.reactions.laugh > 0) && (
					<div className="flex gap-1 mt-1">
						{message.reactions.like > 0 && (
							<button
								onClick={() => addReaction(message.timestamp, "like")}
								className="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-full shadow"
							>
								👍 <span>{message.reactions.like}</span>
							</button>
						)}
						{message.reactions.love > 0 && (
							<button
								onClick={() => addReaction(message.timestamp, "love")}
								className="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-full shadow"
							>
								❤️ <span>{message.reactions.love}</span>
							</button>
						)}
						{message.reactions.laugh > 0 && (
							<button
								onClick={() => addReaction(message.timestamp, "laugh")}
								className="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-full shadow"
							>
								😄 <span>{message.reactions.laugh}</span>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export function MessageList({ messages, currentUser, bottomRef }: MessageListProps) {
	const { addReaction } = useConversationStore()
	const firstLoadRef = useRef(true)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 })
	const [selectedMessage, setSelectedMessage] = useState<number | null>(null)

	useEffect(() => {
		if (firstLoadRef.current) {
			bottomRef?.current?.scrollIntoView()
			firstLoadRef.current = false
		}
	}, [bottomRef])

	// 按照日期分組訊息
	const groupedMessages = useMemo(() => {
		const groups: Record<string, Message[]> = {}

		for (const message of messages) {
			const date = formatMessageDate(message.timestamp)
			if (!groups[date]) {
				groups[date] = []
			}
			groups[date].push(message)
		}

		return groups
	}, [messages])

	const handleLongPress = (e: React.MouseEvent | React.TouchEvent, timestamp: number) => {
		const target = e.target as HTMLElement
		const rect = target.getBoundingClientRect()
		setPickerPosition({
			x: rect.left,
			y: rect.top - 50,
		})
		setSelectedMessage(timestamp)
		setShowEmojiPicker(true)
	}

	return (
		<div className="space-y-8">
			{Object.entries(groupedMessages).map(([date, msgs]) => (
				<div key={date} className="space-y-4">
					<div className="flex justify-center">
						<span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">{date}</span>
					</div>

					{msgs.map((message) =>
						message.messageType === "system" ? (
							<SystemMessage key={message.timestamp} message={message.message} />
						) : (
							<Message
								key={message.timestamp}
								message={message}
								currentUser={currentUser}
								onLongPress={handleLongPress}
								onClick={() => setShowEmojiPicker(false)}
								addReaction={addReaction}
							/>
						),
					)}
				</div>
			))}
			<div ref={bottomRef} />

			{showEmojiPicker && (
				<div
					className="fixed z-50"
					style={{
						left: `${pickerPosition.x}px`,
						top: `${pickerPosition.y}px`,
					}}
				>
					<EmojiPicker
						onEmojiClick={(emojiData) => {
							if (selectedMessage) {
								addReaction(selectedMessage, emojiMap[emojiData.unified])
								setShowEmojiPicker(false)
								setSelectedMessage(null)
							}
						}}
						reactions={["1f44d", "2764-fe0f", "1f604"]}
						reactionsDefaultOpen={true}
						allowExpandReactions={false}
					/>
				</div>
			)}
		</div>
	)
}
