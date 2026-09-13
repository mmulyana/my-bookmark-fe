import { Outlet } from 'react-router-dom'
import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-dialog'
import { BookmarkFormModal } from '@/components/modals/bookmark-form-modal'
import { FolderFormModal } from '@/components/modals/folder-form-modal'
import { TagFormModal } from '@/components/modals/tag-form-modal'
import { Aside } from './aside'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Aside />

        <main className="flex-1 min-w-0 p-4">
          <Outlet />
        </main>
      </div>

      <BookmarkFormModal />
      <FolderFormModal />
      <TagFormModal />
      <ConfirmDeleteDialog />
    </div>
  )
}
