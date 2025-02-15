import type { Message } from "@/types/chat"
import type { User } from "@/stores/chat"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"
import { useConversationStore } from "@/stores/conversation"

interface MessageListProps {
	messages: Message[]
	currentUser: User | null
}

export function MessageList({ messages, currentUser }: MessageListProps) {
	const { addReaction } = useConversationStore()
	console.log({ messages })
	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<div
					key={message.conversationId + message.timestamp}
					className={`flex gap-4 ${message.userId === currentUser?.id ? "flex-row-reverse" : ""}`}
				>
					<img src={message.avatar} alt={message.user} className="w-8 h-8 rounded-full" />

					<div className="flex flex-col max-w-[70%]">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-medium">{message.user}</span>
							<span className="text-sm text-gray-500">
								{formatDistanceToNow(message.timestamp, {
									addSuffix: true,
									locale: zhTW,
								})}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg ${
								message.userId === currentUser?.id ? "bg-blue-500 text-white" : "bg-gray-100"
							}`}
						>
							{message.messageType === "text" && <p>{message.message}</p>}
							{message.messageType === "image" && (
								<img src={message.message} alt="圖片訊息" className="max-w-full rounded" />
							)}
							{message.messageType === "system" && <p className="text-gray-500 text-sm italic">{message.message}</p>}
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
			))}
		</div>
	)
}
