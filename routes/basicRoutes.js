const { Router } = require('express')
const { dashboard_get } = require('../controllers/dashboardController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/faq', (req, res) => {
  res.render('pages/faqs', { rmWhitespace: true })
})

router.get('/support', requireAuth, (req, res) =>
  res.render('pages/support', { rmWhitespace: true })
)

router.get('/agreement', (req, res) => {
  res.render('pages/agreement', { rmWhitespace: true })
})

router.get('/admin/dashboard', requireAuth, dashboard_get)

module.exports = router
