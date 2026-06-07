import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/api'
import PropertyForm from '@/components/PropertyForm'
import NoteForm from '@/components/NoteForm'
import StatusBadge from '@/components/StatusBadge'
import { Property, ViewingNote, PropertyStatus } from '@/types'
import { ArrowLeft, Trash2, Edit, Star, Calendar, Phone, User, FileText, Building2 } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [notes, setNotes] = useState<ViewingNote[]>([])
  const [editing, setEditing] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, notesRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/properties/${id}/notes`)
        ])
        setProperty(propRes.data)
        setNotes(notesRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleUpdate = async (data: Partial<Property>) => {
    const res = await api.put(`/properties/${id}`, data)
    setProperty(res.data)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('确定删除这个房源吗？')) return
    await api.delete(`/properties/${id}`)
    navigate('/')
  }

  const handleCreateNote = async (data: Partial<ViewingNote>) => {
    const res = await api.post(`/properties/${id}/notes`, data)
    setNotes(prev => [res.data, ...prev])
    setShowNoteForm(false)
  }

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('确定删除这条笔记吗？')) return
    await api.delete(`/notes/${noteId}`)
    setNotes(prev => prev.filter(n => n.id !== noteId))
  }

  const handleStatusChange = async (status: PropertyStatus) => {
    const res = await api.put(`/properties/${id}`, { status })
    setProperty(res.data)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">加载中...</div>
  if (!property) return <div className="text-center py-20 text-gray-500">房源不存在</div>

  const avgScore = notes.length > 0
    ? (notes.reduce((sum, n) => sum + n.overallScore, 0) / notes.length).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">房源详情</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {editing ? '取消' : '编辑'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>
      </div>

      {editing ? (
        <PropertyForm
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          initial={property}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {property.photos ? (
            <img src={property.photos} alt={property.address} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{property.address}</h2>
                <p className="text-gray-500">{property.area} · {property.layout} · {property.size}㎡</p>
              </div>
              <StatusBadge status={property.status} />
            </div>

            <p className="text-2xl font-bold text-indigo-600 mb-4">
              {formatCurrency(property.rent)}<span className="text-base font-normal text-gray-400">/月</span>
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {property.landlordName || '未填写'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {property.landlordPhone || '未填写'}
              </div>
            </div>

            {avgScore && (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">{avgScore}</span>
                <span className="text-sm text-gray-400">({notes.length} 条笔记)</span>
              </div>
            )}

            {property.notes && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                {property.notes}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button onClick={() => handleStatusChange('viewing')}
                className={`px-3 py-1.5 text-sm rounded-lg ${property.status === 'viewing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                在看中
              </button>
              <button onClick={() => handleStatusChange('favorited')}
                className={`px-3 py-1.5 text-sm rounded-lg ${property.status === 'favorited' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                收藏
              </button>
              <button onClick={() => handleStatusChange('signed')}
                className={`px-3 py-1.5 text-sm rounded-lg ${property.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                已签约
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Notes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            看房笔记
          </h2>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            写笔记
          </button>
        </div>

        {showNoteForm && (
          <NoteForm
            propertyId={property.id}
            onSubmit={handleCreateNote}
            onCancel={() => setShowNoteForm(false)}
          />
        )}

        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{new Date(note.date).toLocaleDateString('zh-CN')}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {note.overallScore}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-400">采光</p>
                  <p className="font-semibold text-gray-700">{note.lighting}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-400">噪音</p>
                  <p className="font-semibold text-gray-700">{note.noise}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-400">交通</p>
                  <p className="font-semibold text-gray-700">{note.transport}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-400">配套</p>
                  <p className="font-semibold text-gray-700">{note.amenities}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{note.content}</p>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>暂无看房笔记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
