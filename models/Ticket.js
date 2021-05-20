const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
  fileName: String,
})

const messageSchema = mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'senderNameis required'],
    },
    senderId: {
      type: String,
      required: [true, 'senderId is required'],
    },
    body: {
      type: String,
      required: [true, 'body message is required'],
    },
  },
  {
    timestamps: true,
  }
)

const ticketSchema = mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'senderNameis required'],
    },
    userId: {
      type: String,
      required: [true, 'user id is required'],
    },
    requestType: {
      type: String,
      required: [true, 'request type is required'],
    },
    subject: {
      type: String,
      required: [true, 'subject is required'],
    },
    body: {
      type: String,
      required: [true, 'body is required'],
    },
    isOpen: {
      type: Boolean,
      required: [true, 'boolean is required'],
      default: true,
    },
    files: [imageSchema],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
)

const Ticket = mongoose.model('ticket', ticketSchema)

module.exports = Ticket
