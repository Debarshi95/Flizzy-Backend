const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ['EMP', 'HR'],
      default: 'EMP'
    },
    salary: {
      type: String
    },
    token: {
      type: String
    },
    designation: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = model('User', userSchema)
