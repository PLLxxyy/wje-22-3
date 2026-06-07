import { useState } from 'react'
import { ViewingNote } from '@/types'

interface NoteFormProps {
  propertyId: number
  onSubmit: (data: Partial<ViewingNote>) => void
  onCancel: () => void
  initial?: Partial<ViewingNote>
}

export default function NoteForm({ propertyId, onSubmit, onCancel, initial }: NoteFormProps) {
  const [form, setForm] = useState({
    date: initial?.date || new Date().toISOString().split('T')[0],
    lighting: initial?.lighting || 5,
    noise: initial?.noise || 5,
    transport: initial?.transport || 5,
    amenities: initial?.amenities || 5,
    overallScore: initial?.overallScore || 5,
    content: initial?.content || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name.includes('Score') || ['lighting', 'noise', 'transport', 'amenities'].includes(name) ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form, propertyId })
  }

  const ScoreInput = ({ label, name, value }: { label: string; name: string; value: number }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} ({value}/10)</label>
      <input type="range" name={name} min={1} max={10} value={value} onChange={handleChange}
        className="w-full" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>差</span>
        <span>一般</span>
        <span>好</span>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑笔记' : '新增看房笔记'}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">看房日期</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ScoreInput label="采光" name="lighting" value={form.lighting} />
        <ScoreInput label="噪音" name="noise" value={form.noise} />
        <ScoreInput label="交通" name="transport" value={form.transport} />
        <ScoreInput label="周边配套" name="amenities" value={form.amenities} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">综合评分 ({form.overallScore}/10)</label>
        <input type="range" name="overallScore" min={1} max={10} value={form.overallScore} onChange={handleChange}
          className="w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">看房感受</label>
        <textarea name="content" value={form.content} onChange={handleChange} rows={4} required
          placeholder="记录采光、噪音、交通、周边配套等实际感受..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          取消
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
          保存
        </button>
      </div>
    </form>
  )
}
