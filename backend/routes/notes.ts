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

router.delete('/:id', (req: any, res) => {
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
