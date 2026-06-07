import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProperties } from '@/hooks/useProperties'
import PropertyForm from '@/components/PropertyForm'
import StatusBadge from '@/components/StatusBadge'
import { Property, PropertyStatus } from '@/types'
import { Plus, Trash2, Star, Filter, ArrowUpDown, Building2 } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export default function Home() {
  const { properties, loading, createProperty, deleteProperty } = useProperties()
  const [showForm, setShowForm] = useState(false)
  const [sortBy, setSortBy] = useState<'score' | 'date'>('date')
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...properties]

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    if (minRent) result = result.filter(p => p.rent >= Number(minRent))
    if (maxRent) result = result.filter(p => p.rent <= Number(maxRent))
    if (areaFilter) result = result.filter(p => p.area.includes(areaFilter))

    if (sortBy === 'score') {
      result.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [properties, sortBy, statusFilter, minRent, maxRent, areaFilter])

  const avgScore = (property: Property) => {
    // This would come from notes in a real app
    return property.overallScore || 0
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">看房列表</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增房源
        </button>
      </div>

      {showForm && (
        <PropertyForm
          onSubmit={async (data) => {
            await createProperty(data)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'score' | 'date')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
            >
              <option value="date">按时间排序</option>
              <option value="score">按评分排序</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PropertyStatus | 'all')}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
          >
            <option value="all">全部状态</option>
            <option value="viewing">在看中</option>
            <option value="favorited">已收藏</option>
            <option value="signed">已签约</option>
          </select>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">最低租金</label>
              <input
                type="number"
                value={minRent}
                onChange={e => setMinRent(e.target.value)}
                placeholder="元/月"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">最高租金</label>
              <input
                type="number"
                value={maxRent}
                onChange={e => setMaxRent(e.target.value)}
                placeholder="元/月"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">区域</label>
              <input
                type="text"
                value={areaFilter}
                onChange={e => setAreaFilter(e.target.value)}
                placeholder="如：朝阳区"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(property => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {property.photos ? (
              <img src={property.photos} alt={property.address} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 line-clamp-1">{property.address}</h3>
                <StatusBadge status={property.status} />
              </div>
              <p className="text-sm text-gray-500 mb-2">{property.area} · {property.layout} · {property.size}㎡</p>
              <p className="text-lg font-bold text-indigo-600 mb-2">{formatCurrency(property.rent)}<span className="text-sm font-normal text-gray-400">/月</span></p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600">{avgScore(property) || '暂无评分'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (confirm('确定删除这个房源吗？')) {
                      deleteProperty(property.id)
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无房源</p>
          <p className="text-sm mt-1">点击上方按钮添加第一个房源</p>
        </div>
      )}
    </div>
  )
}
