const Ticket = require('../models/Ticket')
const fs = require('fs')
const User = require('../models/User')

const handleErrors = (err) => {
  console.log(err.message, err.code)

  let errors = {}

  if (err.message.includes('ticket validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
    console.log(errors)
  }

  return errors
}

module.exports.ticket_getAll = async (req, res) => {
  const user = res.locals.user
  const isOpen = req.params.status == 'open' ? true : false
  const isAll = req.params.status == 'all' ? true : false
  const possible = req.params.status == 'possible-covid' ? true : false
  try {
    let tickets
    if (possible) {
      tickets = await Ticket.find().sort({ createdAt: -1 })

      tickets = tickets.filter((t) => {
        let points = 0

        t.symptoms.forEach((s) => {
          if (['Difficulty of breathing'].includes(s)) {
            points += 5
          }
          if (['Cough', 'Fatigue', 'Fever'].includes(s)) {
            points += 3
          }
          if (
            [
              'Congestion or runny nose',
              'Diarrhea',
              'Headache',
              'Loss of taste or smell',
              'Muscle Aches',
              'Nausea',
              'Sore Throat',
              'Vomiting',
            ].includes(s)
          ) {
            points += 2
          }
        })
        return points > 10 && t.isOpen
      })
    } else if (isAll) {
      tickets = await Ticket.find().sort({ createdAt: -1 })
    } else {
      tickets = await Ticket.find({ isOpen }).sort({ createdAt: -1 })
    }

    res.render('pages/admin/adminTicket', { tickets, rmWhitespace: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.user_getAll = async (req, res) => {
  const isAdmin = req.params.status == 'admin' ? true : false
  const isAll = req.params.status == 'all' ? true : false
  try {
    let users
    if (isAll) {
      users = await User.find().sort({ createdAt: -1 })
    } else {
      users = await User.find({ isAdmin }).sort({ createdAt: -1 })
    }

    res.render('pages/admin/adminUsers', { users, rmWhitespace: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.user_changeRole = async (req, res) => {
  const userId = req.params.id
  try {
    let user = await User.findById(userId)

    user.isAdmin = !user.isAdmin

    await user.save()
    res.redirect('back')
    // res.render('pages/admin/adminUsers', { users })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
