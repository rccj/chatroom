import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-4xl font-bold">404</h1>
			<p>找不到頁面</p>
			<Button onClick={() => navigate("/")}>回首頁</Button>
		</div>
	)
}
