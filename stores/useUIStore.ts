import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  theme: "light" | "dark" | "system"
  weeklyGoal: number

  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void
  setWeeklyGoal: (goal: number) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      weeklyGoal: 5,

      setTheme: (theme) => set({ theme }),

      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
    }),
    {
      name: "devlog-ui-storage",
    }
  )
)
