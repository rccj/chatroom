import { AppRouter } from "@/routes"
import { useThemeStore } from "@/stores/theme"
import { useEffect } from "react"

function App() {
	const { isDark, setIsDark } = useThemeStore()

	useEffect(() => {
		// 監聽系統主題變化
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		const handleChange = (e: MediaQueryListEvent) => {
			setIsDark(e.matches)
		}

		mediaQuery.addEventListener("change", handleChange)

		// 初始化時設置 dark class
		if (isDark) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}

		return () => mediaQuery.removeEventListener("change", handleChange)
	}, [isDark, setIsDark])

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<AppRouter />
		</div>
	)
}

export default App
