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
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
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
