import { Router } from 'express'
import { db } from '../database'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'pdd-168-secret-key'

function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未登录' })
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }
}

router.use(authMiddleware)

router.get('/', (req: any, res) => {
  const properties = db.prepare(
    'SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId)
  res.json(properties.map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    address: p.address,
    area: p.area,
    rent: p.rent,
    layout: p.layout,
    size: p.size,
    photos: p.photos,
    landlordName: p.landlord_name,
    landlordPhone: p.landlord_phone,
    status: p.status,
    notes: p.notes,
    createdAt: p.created_at
  })))
})

router.get('/:id', (req: any, res) => {
  const property: any = db.prepare(
    'SELECT * FROM properties WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId)

  if (!property) return res.status(404).json({ error: '房源不存在' })

  res.json({
    id: property.id,
    userId: property.user_id,
    address: property.address,
    area: property.area,
    rent: property.rent,
    layout: property.layout,
    size: property.size,
    photos: property.photos,
    landlordName: property.landlord_name,
    landlordPhone: property.landlord_phone,
    status: property.status,
    notes: property.notes,
    createdAt: property.created_at
  })
})

router.post('/', (req: any, res) => {
  const { address, area, rent, layout, size, photos, landlordName, landlordPhone, status, notes } = req.body
  if (!address || !area || !rent || !layout) {
    return res.status(400).json({ error: '请填写必填项' })
  }

  const result = db.prepare(`
    INSERT INTO properties (user_id, address, area, rent, layout, size, photos, landlord_name, landlord_phone, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, address, area, rent, layout, size || null, photos || null, landlordName || null, landlordPhone || null, status || 'viewing', notes || null)

  const property: any = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: property.id,
    userId: property.user_id,
    address: property.address,
    area: property.area,
    rent: property.rent,
    layout: property.layout,
    size: property.size,
    photos: property.photos,
    landlordName: property.landlord_name,
    landlordPhone: property.landlord_phone,
    status: property.status,
    notes: property.notes,
    createdAt: property.created_at
  })
})

router.put('/:id', (req: any, res) => {
  const { address, area, rent, layout, size, photos, landlordName, landlordPhone, status, notes } = req.body

  db.prepare(`
    UPDATE properties SET
    address = ?, area = ?, rent = ?, layout = ?, size = ?, photos = ?, landlord_name = ?, landlord_phone = ?, status = ?, notes = ?
    WHERE id = ? AND user_id = ?
  `).run(address, area, rent, layout, size || null, photos || null, landlordName || null, landlordPhone || null, status || 'viewing', notes || null, req.params.id, req.userId)

  const property: any = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id)
  res.json({
    id: property.id,
    userId: property.user_id,
    address: property.address,
    area: property.area,
    rent: property.rent,
    layout: property.layout,
    size: property.size,
    photos: property.photos,
    landlordName: property.landlord_name,
    landlordPhone: property.landlord_phone,
    status: property.status,
    notes: property.notes,
    createdAt: property.created_at
  })
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM viewing_notes WHERE property_id = ?').run(req.params.id)
  db.prepare('DELETE FROM reminders WHERE property_id = ?').run(req.params.id)
  db.prepare('DELETE FROM properties WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

router.get('/:id/notes', (req: any, res) => {
  const notes = db.prepare(
    'SELECT * FROM viewing_notes WHERE property_id = ? ORDER BY date DESC'
  ).all(req.params.id)
  res.json(notes.map((n: any) => ({
    id: n.id,
    propertyId: n.property_id,
    date: n.date,
    lighting: n.lighting,
    noise: n.noise,
    transport: n.transport,
    amenities: n.amenities,
    overallScore: n.overall_score,
    content: n.content,
    createdAt: n.created_at
  })))
})

router.post('/:id/notes', (req: any, res) => {
  const { date, lighting, noise, transport, amenities, overallScore, content } = req.body
  if (!date || !content) {
    return res.status(400).json({ error: '请填写日期和感受' })
  }

  const result = db.prepare(`
    INSERT INTO viewing_notes (property_id, date, lighting, noise, transport, amenities, overall_score, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.id, date, lighting || 5, noise || 5, transport || 5, amenities || 5, overallScore || 5, content)

  const note: any = db.prepare('SELECT * FROM viewing_notes WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: note.id,
    propertyId: note.property_id,
    date: note.date,
    lighting: note.lighting,
    noise: note.noise,
    transport: note.transport,
    amenities: note.amenities,
    overallScore: note.overall_score,
    content: note.content,
    createdAt: note.created_at
  })
})

export default router
