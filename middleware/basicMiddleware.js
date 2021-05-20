const checkPath = (req, res, next) => {
  res.locals.path = req.path
  next()
}

module.exports = { checkPath }
