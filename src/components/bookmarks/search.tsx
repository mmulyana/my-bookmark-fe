import { useAtom } from 'jotai'
import { searchQueryAtom } from '@/atoms/ui'
import { Search, X } from 'lucide-react'

export const SearchBar = () => {
  const [query, setQuery] = useAtom(searchQueryAtom)

  return (
    <div className="relative w-full">
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-8 pl-8 pr-8 text-sm bg-white border border-slate-200 rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
