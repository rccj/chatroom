import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
import { HomePage } from "@/pages/home"
import { ChatPage } from "@/pages/chat"
import { NotFoundPage } from "@/pages/not-found"
import { useChatStore } from "@/stores/chat"

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "chat",
				element: (
					<ProtectedRoute>
						<ChatPage />
					</ProtectedRoute>
				),
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
])

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user } = useChatStore()

	if (!user) {
		return <Navigate to="/" replace />
	}

	return children
}

export function AppRouter() {
	return <RouterProvider router={router} />
}
