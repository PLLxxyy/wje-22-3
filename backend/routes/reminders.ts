import { Router } from 'express'
import { db } from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', (req: AuthRequest, res) => {
  const reminders = db.prepare(`
    SELECT r.*, p.address as property_address
    FROM reminders r
    LEFT JOIN properties p ON r.property_id = p.id
    WHERE r.user_id = ?
    ORDER BY r.date ASC
  `).all(req.userId)

  res.json(reminders.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    propertyId: r.property_id,
    type: r.type,
    date: r.date,
    note: r.note,
    active: !!r.active,
    propertyAddress: r.property_address,
    createdAt: r.created_at
  })))
})

router.post('/', (req: AuthRequest, res) => {
  const { propertyId, type, date, note } = req.body
  if (!type || !date) {
    return res.status(400).json({ error: '请填写类型和日期' })
  }

  const result = db.prepare(`
    INSERT INTO reminders (user_id, property_id, type, date, note)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.userId, propertyId || null, type, date, note || null)

  const reminder: any = db.prepare('SELECT * FROM reminders WHERE id = ?').get(result.lastInsertRowid)
  res.json({
    id: reminder.id,
    userId: reminder.user_id,
    propertyId: reminder.property_id,
    type: reminder.type,
    date: reminder.date,
    note: reminder.note,
    active: !!reminder.active,
    createdAt: reminder.created_at
  })
})

router.put('/:id', (req: AuthRequest, res) => {
  const { active } = req.body
  db.prepare('UPDATE reminders SET active = ? WHERE id = ? AND user_id = ?')
    .run(active ? 1 : 0, req.params.id, req.userId)
  res.json({ success: true })
})

router.delete('/:id', (req: AuthRequest, res) => {
  db.prepare('DELETE FROM reminders WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
  res.json({ success: true })
})

export default router
