const User = require('../models/User')
const Ticket = require('../models/Ticket')

module.exports.dashboard_get = async (req, res) => {
  try {
    const tickets = await Ticket.find()
    const users = await User.find()
    const ticketReport = generateTicketReport(tickets)
    const userReport = generateUserReport(users)

    res.render('pages/dashboard', {
      ticketReport,
      userReport,
      rmWhitespace: true,
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

const generateTicketMessage = (open) => {
  if (open > 0) {
    return `${open} tickets are still open. Try to answer them all.`
  } else {
    return `Good Job! No tickets are open.`
  }
}

const generateTicketReport = (tickets) => {
  const length = tickets.length
  const open = tickets.filter((t) => t.isOpen).length
  const closed = tickets.filter((t) => !t.isOpen).length
  const message = generateTicketMessage(open)

  return {
    length,
    open,
    closed,
    message,
  }
}
const generateUserReport = (users) => {
  const length = users.length
  const male = users.filter((u) => u.gender == 'Male').length
  const female = users.filter((u) => u.gender == 'Female').length
  const others = users.filter((u) => u.gender == 'Others').length
  return {
    length,
    male,
    female,
    others,
  }
}
