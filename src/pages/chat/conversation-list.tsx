import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { formatMessageDate } from "@/utils/date"
import { Avatar } from "@/components/ui/avatar"

export function ConversationList() {
	const navigate = useNavigate()
	const { conversations } = useConversationStore()
	return (
		<div className="divide-y transition-all duration-300 ease-in-out transform">
			{conversations.map((conversation) => (
				<button
					key={conversation.id}
					className="flex items-center gap-4 p-4 w-full text-left 
							 hover:bg-gray-50 cursor-pointer
							 transition-all duration-200 ease-in-out 
							 hover:scale-[1.01] active:scale-95"
					onClick={() => navigate(`/chat/${conversation.id}`)}
				>
					<div className="flex -space-x-2">
						{conversation.participants.map((participant) => (
							<Avatar
								key={participant.userId}
								src={participant.avatar}
								alt={participant.user}
								className="w-10 h-10 border-2 border-white"
							/>
						))}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<h3 className="font-medium truncate">{conversation.participants.map((p) => p.user).join(", ")}</h3>
							<span className="text-sm text-gray-500">{formatMessageDate(conversation.timestamp, true)}</span>
						</div>
						<p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
					</div>
				</button>
			))}
		</div>
	)
}
