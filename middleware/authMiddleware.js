const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User')

dotenv.config()
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('/login')
      } else {
        // console.log(decodedToken)
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

// Check Current User
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.locals.user = null
        next()
      } else {
        // console.log(decodedToken)
        let user = await User.findById(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { requireAuth, checkUser }
