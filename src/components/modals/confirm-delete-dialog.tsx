import { useAtom } from 'jotai'
import { confirmDeleteDialogAtom } from '@/atoms/ui'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDeleteBookmark } from '@/hooks/use-bookmarks'
import { useDeleteFolder } from '@/hooks/use-folders'
import { useDeleteTag } from '@/hooks/use-tags'
import { useDeleteImage } from '@/hooks/use-images'
import { AlertTriangle } from 'lucide-react'

export const ConfirmDeleteDialog = () => {
  const [state, setState] = useAtom(confirmDeleteDialogAtom)

  const deleteBookmarkMutation = useDeleteBookmark()
  const deleteFolderMutation = useDeleteFolder()
  const deleteTagMutation = useDeleteTag()
  const deleteImageMutation = useDeleteImage()

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }

  const isLoading =
    deleteBookmarkMutation.isPending ||
    deleteFolderMutation.isPending ||
    deleteTagMutation.isPending ||
    deleteImageMutation.isPending

  const handleDelete = async () => {
    try {
      if (state.type === 'bookmark') {
        await deleteBookmarkMutation.mutateAsync(state.id)
      } else if (state.type === 'folder') {
        await deleteFolderMutation.mutateAsync(state.id)
      } else if (state.type === 'tag') {
        await deleteTagMutation.mutateAsync(state.id)
      } else if (state.type === 'image') {
        await deleteImageMutation.mutateAsync(state.id)
      }
      handleClose()
    } catch (err) {
      console.error('Failed to delete item', err)
    }
  }

  const typeLabels = {
    bookmark: 'Bookmark',
    folder: 'Folder',
    tag: 'Tag',
    image: 'Image',
  }

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={handleClose}
      title={`Delete ${typeLabels[state.type] || 'Item'}`}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-100">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-rose-950">"{state.title}"</span>?
            {state.type === 'folder' && (
              <p className="mt-1 text-xs text-rose-700">
                Bookmarks inside this folder will not be deleted, but will become unassigned.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
