const User = require('../models/User')
const Ticket = require('../models/Ticket')

module.exports.dashboard_get = async (req, res) => {
  try {
    const tickets = await Ticket.find()
    const users = await User.find()
    const ticketReport = {
      open: tickets.filter((t) => t.isOpen).length,
      closed: tickets.filter((t) => !t.isOpen).length,
    }
    console.log(ticketReport)
    res.render('pages/dashboard', { tickets, users, rmWhitespace: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
