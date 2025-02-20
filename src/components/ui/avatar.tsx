import { useState } from "react"
import clsx from "clsx"
import { Skeleton } from "@/components/ui/skeleton"

interface AvatarProps {
	src: string
	alt: string
	className?: string
}

export function Avatar({ src, alt, className }: AvatarProps) {
	const [isLoading, setIsLoading] = useState(true)

	return (
		<div className="relative">
			{isLoading && <Skeleton className={clsx("absolute inset-0 rounded-full", className)} />}
			<img src={src} alt={alt} className={clsx("rounded-full", className)} onLoad={() => setIsLoading(false)} />
		</div>
	)
}
