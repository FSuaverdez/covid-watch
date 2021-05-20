const { Router } = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const path = require('path')
const router = Router()

router.get('/attachments/:file', (req, res) => {
  const file = req.params.file

  res.sendFile(path.resolve(__dirname + '/../uploads/' + file))
})

module.exports = router
