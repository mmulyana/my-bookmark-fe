import { useAtom } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchQueryAtom } from '@/atoms/ui'
import { Search, X } from 'lucide-react'

export const SearchBar = () => {
  const [query, setQuery] = useAtom(searchQueryAtom)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleChange = (value: string) => {
    setQuery(value)
    if (value && pathname === '/') navigate('/bookmarks')
  }

  return (
    <div className="relative w-full">
      <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        id="global-search"
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-8 pl-8 pr-8 text-[13px] bg-white/70 border border-line rounded-full transition-colors placeholder:text-muted focus:outline-none focus:bg-white focus:border-black/20"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
