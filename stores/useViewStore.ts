import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ViewState {
  logListView: "list" | "grid"
  dashboardView: "full" | "compact"
  sidebarOpen: boolean

  // Actions
  setLogListView: (view: "list" | "grid") => void
  setDashboardView: (view: "full" | "compact") => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      logListView: "list",
      dashboardView: "full",
      sidebarOpen: true,

      setLogListView: (view) => set({ logListView: view }),

      setDashboardView: (view) => set({ dashboardView: view }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "devlog-view-storage",
    }
  )
)
