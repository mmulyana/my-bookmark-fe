import { useState, useEffect, type FormEvent } from 'react'
import { useAtom } from 'jotai'
import { folderModalAtom } from '@/atoms/ui'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateFolder, useUpdateFolder } from '@/hooks/use-folders'

export const FolderFormModal = () => {
  const [modalState, setModalState] = useAtom(folderModalAtom)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const createFolderMutation = useCreateFolder()
  const updateFolderMutation = useUpdateFolder()

  const isEdit = modalState.mode === 'edit'
  const isLoading = createFolderMutation.isPending || updateFolderMutation.isPending

  useEffect(() => {
    if (modalState.isOpen) {
      setName(modalState.folder?.name || '')
      setError('')
    }
  }, [modalState.isOpen, modalState.folder])

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Folder name is required')
      return
    }

    try {
      if (isEdit && modalState.folder) {
        await updateFolderMutation.mutateAsync({
          id: modalState.folder.id,
          data: { name: trimmed },
        })
      } else {
        await createFolderMutation.mutateAsync({ name: trimmed })
      }
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save folder')
    }
  }

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Folder' : 'New Folder'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="folder-name" className="block text-sm font-medium text-slate-700 mb-1">
            Folder Name
          </label>
          <Input
            id="folder-name"
            placeholder="e.g. Work, Tech, Design"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
