import { create } from "zustand"

interface FilterState {
  tags: string[]
  dateFrom: Date | null
  dateTo: Date | null
  sortBy: "date" | "likes"
  sortOrder: "asc" | "desc"

  // Actions
  setTags: (tags: string[]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  setDateRange: (from: Date | null, to: Date | null) => void
  setSortBy: (sortBy: "date" | "likes") => void
  setSortOrder: (sortOrder: "asc" | "desc") => void
  reset: () => void
}

const initialState = {
  tags: [] as string[],
  dateFrom: null as Date | null,
  dateTo: null as Date | null,
  sortBy: "date" as const,
  sortOrder: "desc" as const,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setTags: (tags) => set({ tags }),

  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    })),

  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),

  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSortOrder: (sortOrder) => set({ sortOrder }),

  reset: () => set(initialState),
}))
