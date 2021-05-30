const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const basicRoutes = require('./routes/basicRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const adminRoutes = require('./routes/adminRoutes')
const fileRoutes = require('./routes/fileRoutes')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const { checkPath } = require('./middleware/basicMiddleware')
const fileUpload = require('express-fileupload')
const axios = require('axios')

const app = express()
dotenv.config()
// middleware
app.use(express.static('public'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload())

// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3000
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(PORT)
    console.log(`Server Running at http://localhost:${PORT}`)
  })
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser, checkPath)
app.get('*', checkUser, checkPath)
app.get('/', async (req, res) => {
  try {
    const data = await axios.get(
      'https://api.covid19api.com/live/country/ph/status/confirmed'
    )
    const cases = data.data
    const latestCase = cases[cases.length - 1]

    latestCase.Confirmed = numberWithCommas(latestCase.Confirmed)
    latestCase.Active = numberWithCommas(latestCase.Active)
    latestCase.Deaths = numberWithCommas(latestCase.Deaths)
    latestCase.Recovered = numberWithCommas(latestCase.Recovered)
    res.render('index', {
      latestCase,
      cases,
      rmWhitespace: true,
    })
  } catch (error) {
    console.log(error)
  }
})
app.use(authRoutes, basicRoutes, ticketRoutes, fileRoutes, adminRoutes)

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
