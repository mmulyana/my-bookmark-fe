import { http, HttpResponse, delay } from 'msw'
import { mockDb } from './db'
import type { CreateBookmarkInput, UpdateBookmarkInput, CreateFolderInput, UpdateFolderInput, CreateTagInput, UpdateTagInput } from '@/types'

export const handlers = [
  http.get('/folders', () => {
    return HttpResponse.json(mockDb.getFolders())
  }),

  http.post('/folders', async ({ request }) => {
    const body = (await request.json()) as CreateFolderInput
    if (!body?.name?.trim()) {
      return HttpResponse.json({ message: 'Folder name is required' }, { status: 400 })
    }
    const folder = mockDb.createFolder(body.name.trim())
    return HttpResponse.json(folder, { status: 201 })
  }),

  http.patch('/folders/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as UpdateFolderInput
    if (!body?.name?.trim()) {
      return HttpResponse.json({ message: 'Folder name is required' }, { status: 400 })
    }
    const updated = mockDb.updateFolder(id, body.name.trim())
    if (!updated) {
      return HttpResponse.json({ message: 'Folder not found' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/folders/:id', ({ params }) => {
    const { id } = params as { id: string }
    const success = mockDb.deleteFolder(id)
    if (!success) {
      return HttpResponse.json({ message: 'Folder not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true })
  }),

  http.get('/tags', () => {
    return HttpResponse.json(mockDb.getTags())
  }),

  http.post('/tags', async ({ request }) => {
    const body = (await request.json()) as CreateTagInput
    if (!body?.name?.trim()) {
      return HttpResponse.json({ message: 'Tag name is required' }, { status: 400 })
    }
    const tag = mockDb.createTag(body.name.trim().toLowerCase())
    return HttpResponse.json(tag, { status: 201 })
  }),

  http.patch('/tags/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as UpdateTagInput
    if (!body?.name?.trim()) {
      return HttpResponse.json({ message: 'Tag name is required' }, { status: 400 })
    }
    const updated = mockDb.updateTag(id, body.name.trim().toLowerCase())
    if (!updated) {
      return HttpResponse.json({ message: 'Tag not found' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/tags/:id', ({ params }) => {
    const { id } = params as { id: string }
    const success = mockDb.deleteTag(id)
    if (!success) {
      return HttpResponse.json({ message: 'Tag not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true })
  }),

  http.get('/bookmarks', () => {
    return HttpResponse.json(mockDb.getBookmarks())
  }),

  http.post('/bookmarks', async ({ request }) => {
    const body = (await request.json()) as CreateBookmarkInput
    if (!body?.url?.trim() || !body?.title?.trim()) {
      return HttpResponse.json({ message: 'URL and title are required' }, { status: 400 })
    }
    const bookmark = mockDb.createBookmark({
      url: body.url.trim(),
      title: body.title.trim(),
      description: body.description?.trim(),
      favicon: body.favicon?.trim() || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(body.url)}&sz=64`,
      imageUrl: body.imageUrl?.trim() || undefined,
      folderId: body.folderId || null,
      tagIds: body.tagIds || [],
      isFavorite: Boolean(body.isFavorite),
    })
    return HttpResponse.json(bookmark, { status: 201 })
  }),

  http.patch('/bookmarks/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as UpdateBookmarkInput
    const updated = mockDb.updateBookmark(id, body)
    if (!updated) {
      return HttpResponse.json({ message: 'Bookmark not found' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/bookmarks/:id', ({ params }) => {
    const { id } = params as { id: string }
    const success = mockDb.deleteBookmark(id)
    if (!success) {
      return HttpResponse.json({ message: 'Bookmark not found' }, { status: 404 })
    }
    return HttpResponse.json({ success: true })
  }),

  http.post('/fetch-metadata', async ({ request }) => {
    const body = (await request.json()) as { url?: string }
    if (!body?.url) {
      return HttpResponse.json({ message: 'URL is required' }, { status: 400 })
    }

    await delay(700)

    try {
      const parsedUrl = new URL(body.url)
      const hostname = parsedUrl.hostname.replace(/^www\./, '')
      const title = `${hostname.charAt(0).toUpperCase() + hostname.slice(1)} — ${parsedUrl.pathname !== '/' ? parsedUrl.pathname.slice(1) : 'Home'}`
      const description = `Curated page content and links from ${hostname}. Automatically fetched for your bookmarks.`
      const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
      const imageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80`

      return HttpResponse.json({
        title,
        description,
        favicon,
        imageUrl,
      })
    } catch {
      return HttpResponse.json({
        title: body.url,
        description: '',
        favicon: `https://www.google.com/s2/favicons?domain=${body.url}&sz=64`,
      })
    }
  }),
]
