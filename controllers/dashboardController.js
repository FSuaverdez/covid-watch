const User = require('../models/User')
const Ticket = require('../models/Ticket')

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

module.exports.dashboard_get = async (req, res) => {
  try {
    const tickets = await Ticket.find()
    const users = await User.find()
    const ticketReport = generateTicketReport(tickets)
    const userReport = generateUserReport(users)
    const possibleUsers = await User.find({ _id: ticketReport.possibleId })
    const possibleReport = generatePossibleReport(possibleUsers)

    // console.log(ticketReport, userReport)
    res.render('pages/dashboard', {
      ticketReport,
      userReport,
      possibleReport,
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
  const possibleCovid = tickets.filter((t) => {
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

  const possibleId = possibleCovid.map((p) => p.userId)
  const requestType = {
    general: tickets.filter((t) => t.requestType == 'General Inquiry').length,
    symptoms: tickets.filter((t) => t.requestType == 'Symptoms').length,
    medication: tickets.filter((t) => t.requestType == 'Medication').length,
    consultation: tickets.filter((t) => t.requestType == 'Consultation').length,
    follow: tickets.filter((t) => t.requestType == 'Follow Up').length,
    others: tickets.filter((t) => t.requestType == 'Others').length,
  }

  return {
    length,
    open,
    closed,
    message,
    requestType,
    possibleCovid: possibleCovid.length,
    possibleId,
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

const generatePossibleReport = (users) => {
  const male = users.filter((u) => u.gender == 'Male').length
  const female = users.filter((u) => u.gender == 'Female').length
  const others = users.filter((u) => u.gender == 'Others').length

  const ages = users.map((u) => getAge(u.birthday))
  const sum = ages.reduce((a, b) => a + b, 0)
  const averageAge = sum / ages.length || 0
  return {
    male,
    female,
    others,
    averageAge,
  }
}

const getAge = (dateString) => {
  var today = new Date()
  var birthDate = new Date(dateString)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
