import { Outlet } from 'react-router-dom'
import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-dialog'
import { BookmarkFormModal } from '@/components/modals/bookmark-form-modal'
import { FolderFormModal } from '@/components/modals/folder-form-modal'
import { TagFormModal } from '@/components/modals/tag-form-modal'
import { Aside } from './aside'

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex">
        <Aside />

        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-5xl px-6 sm:px-10 py-10">
            <Outlet />
          </div>
        </main>
      </div>

      <BookmarkFormModal />
      <FolderFormModal />
      <TagFormModal />
      <ConfirmDeleteDialog />
    </div>
  )
}
