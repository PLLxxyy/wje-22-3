import { useState, useEffect } from 'react'
import api from '@/utils/api'
import { Property } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { GitCompare, Star, Building2, Check } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export default function Compare() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [compareList, setCompareList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/properties')
        setProperties(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      }
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const handleCompare = async () => {
    const list = await Promise.all(
      selected.map(id => api.get(`/properties/${id}`).then(r => r.data))
    )
    setCompareList(list)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <GitCompare className="w-6 h-6 text-indigo-500" />
        房源对比
      </h1>

      {compareList.length === 0 ? (
        <>
          <p className="text-sm text-gray-500">选择 2-3 个房源进行对比</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(p => (
              <div
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
                  selected.includes(p.id) ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{p.address}</h3>
                  {selected.includes(p.id) && (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">{p.area} · {p.layout}</p>
                <p className="text-lg font-bold text-indigo-600 mt-1">{formatCurrency(p.rent)}</p>
              </div>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleCompare}
                disabled={selected.length < 2}
                className="px-6 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                对比选中的 {selected.length} 个房源
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => { setCompareList([]); setSelected([]) }}
            className="text-sm text-indigo-500 hover:text-indigo-600"
          >
            重新选择
          </button>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-medium text-gray-500">对比项</th>
                  {compareList.map(p => (
                    <th key={p.id} className="p-4 text-left">
                      <div className="font-semibold text-gray-800">{p.address}</div>
                      <div className="text-xs text-gray-400">{p.area}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">照片</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4">
                      {p.photos ? (
                        <img src={p.photos} alt="" className="w-24 h-16 object-cover rounded" />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-300" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">月租</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4 font-semibold text-indigo-600">{formatCurrency(p.rent)}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">户型</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4">{p.layout}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">面积</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4">{p.size}㎡</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">状态</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4"><StatusBadge status={p.status} /></td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">房东</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4">{p.landlordName || '-'}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-500">电话</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4">{p.landlordPhone || '-'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-gray-500">备注</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-4 text-gray-600">{p.notes || '-'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
