import { useNavigate } from "react-router-dom"
import { useConversationStore } from "@/stores/conversation"
import { formatMessageDate } from "@/utils/date"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConversationList() {
	const navigate = useNavigate()
	const { conversations } = useConversationStore()
	return (
		<div className="h-[calc(100vh-8rem)] overflow-y-auto px-4 py-2">
			<div className="divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out transform">
				{conversations.map((conversation) => (
					<button
						key={conversation.id}
						className="flex items-center gap-4 p-4 w-full text-left 
								 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer
								 transition-all duration-200 ease-in-out 
								 hover:scale-[1.01] active:scale-95
								 dark:text-gray-100"
						onClick={() => navigate(`/chat/${conversation.id}`)}
					>
						<div className="flex -space-x-2 flex-shrink-0">
							{conversation.participants.slice(0, conversation.participants.length >= 3 ? 1 : 2).map((participant) => (
								<Avatar
									key={participant.userId}
									src={participant.avatar}
									alt={participant.user}
									className="w-10 h-10 border-2 border-white"
								/>
							))}
							{conversation.participants.length >= 3 && (
								<div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-900 text-sm font-medium dark:text-gray-100">
									+{conversation.participants.length - 1}
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<h3 className="font-medium truncate dark:text-gray-100">
												{conversation.participants.map((p) => p.user).join(", ")}
											</h3>
										</TooltipTrigger>
										<TooltipContent className="dark:bg-gray-800 dark:text-gray-100">
											<p>{conversation.participants.map((p) => p.user).join(", ")}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
									{formatMessageDate(conversation.timestamp, true)}
								</span>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
