const Ticket = require('../models/Ticket')
const User = require('../models/User')
const fs = require('fs')
const nodemailer = require('nodemailer')
const { generateHtml } = require('./generateHtml')

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

module.exports.submit_get = (req, res) => {
  res.render('pages/submit-ticket', { rmWhitespace: true })
}

module.exports.submit_post = async (req, res) => {
  console.log(req.body)
  const { requestType, subject, body } = req.body
  const user = res.locals.user
  try {
    const { subject, requestType, userId } = req.body
    const ticket = await Ticket.create({
      senderName: `${user.firstName} ${user.lastName}`,
      subject,
      requestType,
      userId: user._id,
      body,
    })

    const image = req.files?.file
    if (image) {
      fs.writeFileSync(__dirname + '/../uploads/' + image.name, image.data)
      ticket.files.push({
        fileName: image.name,
      })

      await ticket.save()
    }

    res.status(201).json({ ticket: ticket._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
module.exports.ticket_get = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    res.render('pages/ticket', { ticket, rmWhitespace: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.ticket_close = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    ticket.isOpen = false
    await ticket.save()

    res.redirect(`/support/ticket/${req.params.id}`)
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.ticket_getAll = async (req, res) => {
  const user = res.locals.user
  try {
    const tickets = await Ticket.find({ userId: user._id })

    res.render('pages/service-status', { tickets, rmWhitespace: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports.message_post = async (req, res) => {
  const user = res.locals.user
  const { body } = req.body
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (ticket.isOpen) {
      ticket.messages.push({
        senderName: `${user.firstName} ${user.lastName}`,
        senderId: user._id,
        body,
      })

      await ticket.save()
      if (user._id != ticket.userId) {
        const ticketSender = await User.findById(ticket.userId)
        const email = ticketSender.email
        console.log('Notify')
        sendEmailNotification(ticket, body, email)
      }
    }
    res.redirect(req.originalUrl)
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

const sendEmailNotification = (ticket, body, email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'customer.service.comphub@gmail.com',
      pass: 'ljdljqfhfrnjifpj',
    },
  })

  let mailOptions = {
    from: 'customer.service.comphub@gmail.com',
    to: email,
    subject: `New Ticket Reply!`,
    text: `New Reply\n\n${body}`,
    html: generateHtml(ticket, body),
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
  })
}
