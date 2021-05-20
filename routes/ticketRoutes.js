const { Router } = require('express')

const {
  submit_get,
  submit_post,
  message_post,
  ticket_get,
  ticket_getAll,
  ticket_close,
} = require('../controllers/ticketController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

const router = Router()

router.get('/support/submit', requireAuth, submit_get)
router.post('/support/submit', requireAuth, checkUser, submit_post)
router.post('/support/ticket/:id', requireAuth, checkUser, message_post)
router.post('/support/ticket/:id/close', requireAuth, checkUser, ticket_close)
router.get('/support/ticket/:id', requireAuth, ticket_get)
router.get('/support/status', requireAuth, ticket_getAll)

module.exports = router
