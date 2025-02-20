import { useCallback, useRef } from "react"

interface Options {
	onLongPress: (e: React.MouseEvent | React.TouchEvent) => void
	onClick?: () => void
	ms?: number
}

export const useLongPress = ({ onLongPress, onClick, ms = 500 }: Options) => {
	const timerRef = useRef<number>(null)
	const isLongPress = useRef(false)

	const start = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			isLongPress.current = false
			timerRef.current = window.setTimeout(() => {
				isLongPress.current = true
				onLongPress(e)
			}, ms)
		},
		[onLongPress, ms],
	)

	const clear = useCallback(() => {
		if (timerRef.current) {
			window.clearTimeout(timerRef.current)
		}
		if (!isLongPress.current && onClick) {
			onClick()
		}
	}, [onClick])

	return {
		onMouseDown: start,
		onTouchStart: start,
		onMouseUp: clear,
		onMouseLeave: clear,
		onTouchEnd: clear,
	}
}
