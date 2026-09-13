import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { isAuthenticatedAtom } from '@/atoms/auth'
import { authApi } from '@/api/auth'
import { setTokens } from '@/lib/auth-storage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookmarkCheck } from 'lucide-react'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname || '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const { access_token, refresh_token } = await authApi.login(email, password)
      setTokens(access_token, refresh_token)
      setIsAuthenticated(true)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs mb-3">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-slate-900 text-xl">My Bookmark</h1>
          <p className="text-sm text-slate-500 mt-1">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
