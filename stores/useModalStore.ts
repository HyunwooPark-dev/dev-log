import { create } from "zustand"

interface ModalState {
  isLogFormOpen: boolean
  editingLogId: string | null
  isConfirmDialogOpen: boolean
  confirmDialogData: {
    title: string
    description: string
    onConfirm: () => void
  } | null

  // Actions
  openLogForm: (editingId?: string) => void
  closeLogForm: () => void
  openConfirmDialog: (title: string, description: string, onConfirm: () => void) => void
  closeConfirmDialog: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isLogFormOpen: false,
  editingLogId: null,
  isConfirmDialogOpen: false,
  confirmDialogData: null,

  openLogForm: (editingId) =>
    set({
      isLogFormOpen: true,
      editingLogId: editingId || null,
    }),

  closeLogForm: () =>
    set({
      isLogFormOpen: false,
      editingLogId: null,
    }),

  openConfirmDialog: (title, description, onConfirm) =>
    set({
      isConfirmDialogOpen: true,
      confirmDialogData: { title, description, onConfirm },
    }),

  closeConfirmDialog: () =>
    set({
      isConfirmDialogOpen: false,
      confirmDialogData: null,
    }),
}))
