import { Router } from 'express'
import { db } from '../database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.delete('/:id', (req: AuthRequest, res) => {
  const note: any = db.prepare(`
    SELECT vn.* FROM viewing_notes vn
    JOIN properties p ON vn.property_id = p.id
    WHERE vn.id = ? AND p.user_id = ?
  `).get(req.params.id, req.userId)

  if (!note) return res.status(404).json({ error: '笔记不存在' })

  db.prepare('DELETE FROM viewing_notes WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
