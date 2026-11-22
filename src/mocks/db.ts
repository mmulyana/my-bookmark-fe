import type { Bookmark, Folder, Image, Tag } from '@/types'

const folders: Folder[] = [
  { id: 'f-illustrations', name: 'Illustrations' },
  { id: 'f-1', name: 'Tech & Dev' },
  { id: 'f-2', name: 'Design Inspiration' },
  { id: 'f-3', name: 'Reading List' },
]

const tags: Tag[] = [
  { id: 't-illustrations', name: 'illustrations' },
  { id: 't-library', name: 'library' },
  { id: 't-1', name: 'react' },
  { id: 't-2', name: 'typescript' },
  { id: 't-3', name: 'tailwind' },
  { id: 't-4', name: 'design' },
  { id: 't-5', name: 'tools' },
]

const seedImage = (n: number, w: number, h: number, tagIds: string[]): Image => ({
  id: `i-${n}`,
  name: `sample-${n}.jpg`,
  url: `https://picsum.photos/seed/mybookmark-${n}/${w}/${h}`,
  mimeType: 'image/jpeg',
  sizeBytes: 120_000 + n * 7_000,
  width: w,
  height: h,
  tagIds,
  createdAt: new Date(Date.UTC(2026, 0, 30 - n)).toISOString(),
})

let images: Image[] = [
  seedImage(1, 600, 800, ['t-4']),
  seedImage(2, 800, 600, ['t-4', 't-illustrations']),
  seedImage(3, 700, 700, []),
  seedImage(4, 600, 900, ['t-illustrations']),
  seedImage(5, 900, 600, []),
  seedImage(6, 640, 640, ['t-5']),
]

let bookmarks: Bookmark[] = [
  {
    id: 'b-1',
    url: 'https://icons8.com/vector-creator',
    title: 'Vector Creator — Create engaging illustrations in-browser for free',
    description: 'Create striking illustrations for free right in your browser, no design experience required. Use elements in 12 styles to spice up your UI or social media.',
    favicon: 'https://icons8.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations', 't-tools'],
    isFavorite: true,
    createdAt: '2019-10-17T10:00:00.000Z',
  },
  {
    id: 'b-2',
    url: 'https://fresh-folk.com',
    title: 'Fresh Folk',
    description: 'An illustration library of people and objects',
    favicon: 'https://fresh-folk.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations'],
    isFavorite: false,
    createdAt: '2019-11-19T14:30:00.000Z',
  },
  {
    id: 'b-3',
    url: 'https://humaaans.com',
    title: 'Humaaans: Mix-&-Match illustration library',
    description: 'Mix-&-match illustrations of people with a design library for InVision Studio and Sketch.',
    favicon: 'https://humaaans.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations', 't-library'],
    isFavorite: true,
    createdAt: '2019-01-10T08:00:00.000Z',
  },
  {
    id: 'b-4',
    url: 'https://glazestock.com',
    title: 'Glaze | Illustrations',
    description: 'Free illustrations, for everything. Memorable products, brands, & presentations start with free illustration library',
    favicon: 'https://glazestock.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations'],
    isFavorite: false,
    createdAt: '2019-09-29T16:20:00.000Z',
  },
  {
    id: 'b-5',
    url: 'https://stubborn.rocks',
    title: 'Stubborn Illustrations Kit',
    description: 'Create a unique story for a website, application, or presentation. There are 30 main illustration background images in the pack.',
    favicon: 'https://stubborn.rocks/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations', 't-library'],
    isFavorite: false,
    createdAt: '2019-03-05T09:15:00.000Z',
  },
  {
    id: 'b-6',
    url: 'https://opendoodles.com',
    title: 'Open Doodles - Free sketchy illustrations',
    description: 'A library of sketchy illustrations of people free for personal and commercial use.',
    favicon: 'https://opendoodles.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations'],
    isFavorite: true,
    createdAt: '2019-11-22T11:45:00.000Z',
  },
  {
    id: 'b-7',
    url: 'https://tasteminty.com',
    title: 'Get custom illustrations directly from remote artists',
    description: 'Hire vetted remote illustrators and artists for custom branding and visual identity.',
    favicon: 'https://tasteminty.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations'],
    isFavorite: false,
    createdAt: '2020-03-26T00:57:00.000Z',
  },
  {
    id: 'b-8',
    url: 'https://growwwkit.com',
    title: 'Home',
    description: 'Growwwkit illustrations and 3D scenes for web apps and modern mobile interfaces.',
    favicon: 'https://growwwkit.com/favicon.ico',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=120&h=120&fit=crop&q=80',
    folderId: 'f-illustrations',
    tagIds: ['t-illustrations'],
    isFavorite: false,
    createdAt: '2020-02-29T23:03:00.000Z',
  },
]

export const mockDb = {
  getFolders: () => [...folders],
  getFolderById: (id: string) => folders.find((f) => f.id === id),
  createFolder: (name: string): Folder => {
    const newFolder: Folder = {
      id: `f-${Date.now()}`,
      name,
    }
    folders.push(newFolder)
    return newFolder
  },
  updateFolder: (id: string, name: string): Folder | null => {
    const folder = folders.find((f) => f.id === id)
    if (!folder) return null
    folder.name = name
    return folder
  },
  deleteFolder: (id: string): boolean => {
    const index = folders.findIndex((f) => f.id === id)
    if (index === -1) return false
    folders.splice(index, 1)
    bookmarks = bookmarks.map((b) => (b.folderId === id ? { ...b, folderId: null } : b))
    return true
  },

  getTags: () => [...tags],
  getTagById: (id: string) => tags.find((t) => t.id === id),
  createTag: (name: string): Tag => {
    const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase())
    if (existing) return existing
    const newTag: Tag = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
    }
    tags.push(newTag)
    return newTag
  },
  updateTag: (id: string, name: string): Tag | null => {
    const tag = tags.find((t) => t.id === id)
    if (!tag) return null
    tag.name = name
    return tag
  },
  deleteTag: (id: string): boolean => {
    const index = tags.findIndex((t) => t.id === id)
    if (index === -1) return false
    tags.splice(index, 1)
    images = images.map((i) => ({ ...i, tagIds: i.tagIds.filter((tId) => tId !== id) }))
    bookmarks = bookmarks.map((b) => ({
      ...b,
      tagIds: b.tagIds.filter((tId) => tId !== id),
    }))
    return true
  },

  getBookmarks: () => [...bookmarks],
  getBookmarkById: (id: string) => bookmarks.find((b) => b.id === id),
  createBookmark: (data: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark => {
    const newBookmark: Bookmark = {
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data,
    }
    bookmarks.unshift(newBookmark)
    return newBookmark
  },
  updateBookmark: (id: string, data: Partial<Omit<Bookmark, 'id' | 'createdAt'>>): Bookmark | null => {
    const bookmark = bookmarks.find((b) => b.id === id)
    if (!bookmark) return null
    Object.assign(bookmark, data)
    return bookmark
  },
  deleteBookmark: (id: string): boolean => {
    const index = bookmarks.findIndex((b) => b.id === id)
    if (index === -1) return false
    bookmarks.splice(index, 1)
    return true
  },

  getImages: (opts: { tagIds: string[]; hasTags?: boolean; lastId?: string; perPage: number }): Image[] => {
    let result = images.filter(
      (i) =>
        (opts.hasTags === undefined || (i.tagIds.length > 0) === opts.hasTags) &&
        opts.tagIds.every((t) => i.tagIds.includes(t)),
    )
    result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (opts.lastId) {
      const idx = result.findIndex((i) => i.id === opts.lastId)
      if (idx !== -1) result = result.slice(idx + 1)
    }
    return result.slice(0, opts.perPage)
  },
  createImage: (file: File, width: number | null, height: number | null): Image => {
    const image: Image = {
      id: `i-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      mimeType: file.type,
      sizeBytes: file.size,
      width,
      height,
      tagIds: [],
      createdAt: new Date().toISOString(),
    }
    images.unshift(image)
    return image
  },
  updateImage: (id: string, data: { name?: string; tagIds?: string[] }): Image | null => {
    const image = images.find((i) => i.id === id)
    if (!image) return null
    if (data.name !== undefined) image.name = data.name
    if (data.tagIds !== undefined) image.tagIds = data.tagIds
    return { ...image }
  },
  deleteImage: (id: string): boolean => {
    const index = images.findIndex((i) => i.id === id)
    if (index === -1) return false
    images.splice(index, 1)
    return true
  },
}
