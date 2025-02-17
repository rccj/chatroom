import { useState } from "react"
import clsx from "clsx"

interface AvatarProps {
	src: string
	alt: string
	className?: string
}

export function Avatar({ src, alt, className }: AvatarProps) {
	const [isLoading, setIsLoading] = useState(true)

	return (
		<div className="relative">
			{isLoading && <div className={clsx("absolute inset-0 bg-gray-200 rounded-full animate-pulse", className)} />}
			<img src={src} alt={alt} className={clsx("rounded-full", className)} onLoad={() => setIsLoading(false)} />
		</div>
	)
}
