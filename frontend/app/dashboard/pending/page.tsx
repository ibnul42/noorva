import { getUserFromCookies } from '@/lib/authServer'
import PendingList from './PendingList'

export default async function PendingPage() {
  const user = await getUserFromCookies()
  if (!user) return null

  // Only allow super-user
  if (user.role !== 'super-user') {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl w-full bg-white rounded-2xl shadow p-8 mb-8">
          <h1 className="text-2xl font-bold text-emerald-700">Not authorized</h1>
          <p className="mt-4 text-slate-600">You must be a super-admin to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl w-full bg-white rounded-2xl shadow p-8 mb-8">
        <h1 className="text-2xl font-bold text-emerald-700">Pending User Requests</h1>
        <p className="mt-4 text-slate-600">Review and approve or reject pending user registrations.</p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {/* Client component handles fetching and actions */}
        <PendingList />
      </div>
    </div>
  )
}
