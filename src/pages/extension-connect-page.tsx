import { BookmarkCheck, CheckCircle2 } from 'lucide-react'

export const ExtensionConnectPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs mb-4 mx-auto">
          <BookmarkCheck className="w-6 h-6" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <h1 className="font-semibold text-slate-900 text-lg">Extension connected</h1>
          <p className="text-sm text-slate-500 mt-2">
            You can close this tab and go back to the My Bookmark extension.
          </p>
        </div>
      </div>
    </div>
  )
}
