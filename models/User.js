const mongoose = require('mongoose')
const { isEmail, isMobilePhone } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an Email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter an Password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your Last Name'],
    },
    firstName: {
      type: String,
      required: [true, 'Please enter your First Name'],
    },
    contactNo: {
      type: String,
      required: [true, 'Please enter your Contact Number'],
      validate: [isMobilePhone, 'Please enter a valid phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please enter your Address'],
    },
    gender: {
      type: String,
      required: [true, 'Please select your Gender'],
    },
    isAdmin: {
      type: Boolean,
      required: [true, 'Please specify User Role'],
      default: false,
    },
  },
  {
    timestaps: true,
  }
)

// Static Method to Login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect Password')
  }
  throw Error('Incorrect Email')
}

const User = mongoose.model('user', userSchema)

module.exports = User
