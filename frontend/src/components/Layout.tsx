import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Home, GitCompare, User, Settings, LogOut, Building2 } from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  const navItems = [
    { path: '/', label: '看房列表', icon: Home },
    { path: '/compare', label: '对比', icon: GitCompare },
    { path: '/profile', label: '个人中心', icon: User },
    { path: '/settings', label: '设置', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">看房记录</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user.name?.[0] || user.username?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name || user.username}</p>
              <p className="text-xs text-gray-500">{user.username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
