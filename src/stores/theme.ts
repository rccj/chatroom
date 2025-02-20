import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeStore {
	isDark: boolean
	toggleTheme: () => void
	setIsDark: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
			toggleTheme: () =>
				set((state) => {
					const isDark = !state.isDark
					if (isDark) {
						document.documentElement.classList.add("dark")
					} else {
						document.documentElement.classList.remove("dark")
					}
					return { isDark }
				}),
			setIsDark: (isDark) => {
				if (isDark) {
					document.documentElement.classList.add("dark")
				} else {
					document.documentElement.classList.remove("dark")
				}
				set({ isDark })
			},
		}),
		{
			name: "theme-storage",
		},
	),
)
