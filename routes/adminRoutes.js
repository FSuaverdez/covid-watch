const { Router } = require('express')

const {
  ticket_getAll,
  user_changeRole,
  user_getAll,
} = require('../controllers/adminController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

const router = Router()

router.get('/admin/tickets/:status', requireAuth, checkUser, ticket_getAll)
router.get('/admin/users/:status', requireAuth, checkUser, user_getAll)
router.post('/admin/users/:id', requireAuth, checkUser, user_changeRole)

module.exports = router
