import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/utils/api'
import StatusBadge from '@/components/StatusBadge'
import { Property, Reminder } from '@/types'
import { User, Building2, Star, Clock, Bell } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export default function Profile() {
  const [properties, setProperties] = useState<Property[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, remRes] = await Promise.all([
          api.get('/properties'),
          api.get('/reminders')
        ])
        setProperties(propRes.data)
        setReminders(remRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const byStatus = (status: string) => properties.filter(p => p.status === status)

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <User className="w-6 h-6 text-indigo-500" />
        个人中心
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{byStatus('viewing').length}</p>
              <p className="text-sm text-gray-500">在看中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{byStatus('favorited').length}</p>
              <p className="text-sm text-gray-500">已收藏</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{byStatus('signed').length}</p>
              <p className="text-sm text-gray-500">已签约</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties by status */}
      <div className="space-y-4">
        {(['viewing', 'favorited', 'signed'] as const).map(status => {
          const list = byStatus(status)
          if (list.length === 0) return null
          return (
            <div key={status} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {status === 'viewing' ? '在看中' : status === 'favorited' ? '已收藏' : '已签约'}
              </h2>
              <div className="space-y-3">
                {list.map(p => (
                  <Link
                    key={p.id}
                    to={`/properties/${p.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{p.address}</p>
                      <p className="text-sm text-gray-500">{p.area} · {p.layout}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-indigo-600">{formatCurrency(p.rent)}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-indigo-500" />
          签约提醒
        </h2>
        {reminders.length === 0 ? (
          <p className="text-sm text-gray-400">暂无提醒</p>
        ) : (
          <div className="space-y-2">
            {reminders.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.type}</p>
                  <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('zh-CN')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${r.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {r.active ? '进行中' : '已结束'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
