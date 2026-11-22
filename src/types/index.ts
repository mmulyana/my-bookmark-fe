export interface Bookmark {
  id: string
  url: string
  title: string          // auto-fetched, editable
  description?: string   // auto-fetched, editable
  favicon?: string        // auto-fetched
  imageUrl?: string       // preview image/thumbnail
  folderId?: string | null
  tagIds: string[]
  isFavorite: boolean
  createdAt: string       // ISO date
}

export interface Folder {
  id: string
  name: string
}

export interface Tag {
  id: string
  name: string
}

export interface FetchMetadataResponse {
  title: string
  description?: string
  favicon?: string
  imageUrl?: string
}

export interface CreateBookmarkInput {
  url: string
  title: string
  description?: string
  favicon?: string
  imageUrl?: string
  folderId?: string | null
  tagIds?: string[]
  isFavorite?: boolean
}

export interface UpdateBookmarkInput {
  url?: string
  title?: string
  description?: string
  favicon?: string
  imageUrl?: string
  folderId?: string | null
  tagIds?: string[]
  isFavorite?: boolean
}

export interface CreateFolderInput {
  name: string
}

export interface UpdateFolderInput {
  name: string
}

export interface CreateTagInput {
  name: string
}

export interface UpdateTagInput {
  name: string
}

export interface Image {
  id: string
  name: string
  url: string
  mimeType: string
  sizeBytes: number
  width?: number | null
  height?: number | null
  tagIds: string[]
  createdAt: string
}

export interface UpdateImageInput {
  name?: string
  tagIds?: string[]
}

export interface UploadFailure {
  name: string
  message: string
}

export interface UploadImagesResult {
  images: Image[]
  failed: UploadFailure[]
}
