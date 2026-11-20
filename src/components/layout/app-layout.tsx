import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { Menu } from 'lucide-react'
import { mobileNavOpenAtom } from '@/atoms/ui'
import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-dialog'
import { BookmarkFormModal } from '@/components/modals/bookmark-form-modal'
import { FolderFormModal } from '@/components/modals/folder-form-modal'
import { TagFormModal } from '@/components/modals/tag-form-modal'
import { Aside } from './aside'

export const AppLayout = () => {
  const [navOpen, setNavOpen] = useAtom(mobileNavOpenAtom)
  const { pathname } = useLocation()

  useEffect(() => {
    setNavOpen(false)
  }, [pathname, setNavOpen])

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex">
        <Aside />

        {navOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 min-w-0">
          <div className="md:hidden sticky top-0 z-20 h-12 flex items-center gap-2 px-4 bg-canvas/90 backdrop-blur border-b border-line">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="size-8 -ml-1.5 grid place-items-center rounded-lg hover:bg-black/5 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[13px] font-semibold">My Bookmark</span>
          </div>

          <div className="mx-auto max-w-5xl px-4 sm:px-10 py-6 md:py-10">
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
