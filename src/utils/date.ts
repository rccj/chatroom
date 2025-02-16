import { format, isToday, isYesterday } from "date-fns"
import { zhTW } from "date-fns/locale"

export function formatMessageDate(timestamp: number) {
	const date = new Date(timestamp)

	if (isToday(date)) {
		return format(date, "aa hh:mm", { locale: zhTW })
	}

	if (isYesterday(date)) {
		return "昨天"
	}

	return format(date, "yyyy/MM/dd", { locale: zhTW })
}

export function formatMessageTime(timestamp: number) {
	return format(new Date(timestamp), "aa hh:mm", { locale: zhTW })
}
