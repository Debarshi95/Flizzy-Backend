const { Schema, model, Types } = require('mongoose')

const leaveSchema = new Schema(
  {
    reason: {
      type: String,
      required: true
    },
    user: {
      type: Types.ObjectId,
      ref: 'user'
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    leaveStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
)

module.exports = model('LeaveRecord', leaveSchema)
