import { useState, useEffect, type FormEvent } from 'react'
import { useAtom } from 'jotai'
import { tagModalAtom } from '@/atoms/ui'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateTag, useUpdateTag } from '@/hooks/use-tags'

export const TagFormModal = () => {
  const [modalState, setModalState] = useAtom(tagModalAtom)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const createTagMutation = useCreateTag()
  const updateTagMutation = useUpdateTag()

  const isEdit = modalState.mode === 'edit'
  const isLoading = createTagMutation.isPending || updateTagMutation.isPending

  useEffect(() => {
    if (modalState.isOpen) {
      setName(modalState.tag?.name || '')
      setError('')
    }
  }, [modalState.isOpen, modalState.tag])

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) {
      setError('Tag name is required')
      return
    }

    try {
      if (isEdit && modalState.tag) {
        await updateTagMutation.mutateAsync({
          id: modalState.tag.id,
          data: { name: trimmed },
        })
      } else {
        await createTagMutation.mutateAsync({ name: trimmed })
      }
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save tag')
    }
  }

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Tag' : 'New Tag'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tag-name" className="block text-sm font-medium text-slate-700 mb-1">
            Tag Name
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 select-none text-sm font-medium">#</span>
            <Input
              id="tag-name"
              placeholder="e.g. frontend, inspiration, tutorial"
              value={name}
              onChange={(e) => {
                setName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))
                if (error) setError('')
              }}
              className="pl-7"
              autoFocus
            />
          </div>
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Tag'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
