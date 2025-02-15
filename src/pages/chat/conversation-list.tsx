import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

export function ConversationList() {
	const navigate = useNavigate()
	const { conversations } = useConversationStore()
	return (
		<div className="divide-y">
			{conversations.map((conversation) => (
				<button
					key={conversation.id}
					className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer w-full text-left"
					onClick={() => navigate(`/chat/${conversation.id}`)}
				>
					<div className="flex -space-x-2">
						{conversation.participants.map((participant) => (
							<img
								key={participant.userId}
								src={participant.avatar}
								alt={participant.user}
								className="w-10 h-10 rounded-full border-2 border-white"
							/>
						))}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<h3 className="font-medium truncate">{conversation.participants.map((p) => p.user).join(", ")}</h3>
							<span className="text-sm text-gray-500">
								{formatDistanceToNow(conversation.timestamp, {
									addSuffix: true,
									locale: zhTW,
								})}
							</span>
						</div>
						<p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
					</div>
				</button>
			))}
		</div>
	)
}
