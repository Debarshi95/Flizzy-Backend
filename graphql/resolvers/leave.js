const { UserInputError } = require('apollo-server')
const moment = require('moment')
const LeaveRecord = require('../../models/Leave')
const User = require('../../models/User')
const { appendChar } = require('../../utils/helperfunctions')

const createLeaveRecord = async (_, args, ctx) => {
  const { headers } = ctx.req
  const { startDate = '', endDate = '', reason = '' } = args
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  if (!startDate || !endDate) {
    throw new UserInputError('Dates not provided')
  }

  const user = await User.findOne({ token })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  const newRecord = new LeaveRecord({
    startDate,
    endDate,
    reason,
    user
  })

  await newRecord.save()

  return { success: true, message: 'Request sent successfully' }
}

const updateLeaveRecord = async (_, args, ctx) => {
  const { headers } = ctx.req
  const { employeeId = '', status } = args
  const token = headers?.authorization || null

  if (!token || !employeeId) {
    throw new UserInputError('Token or Id not provided')
  }

  const adminUser = await User.findOne({ token })

  if (!adminUser) {
    throw new UserInputError("User doesn't exist")
  }

  if (adminUser.role !== 'HR') {
    throw new UserInputError("You're not authorized to access this resource")
  }

  const employeeUser = await User.findOne({ _id: employeeId })
  const record = await LeaveRecord.findOne({ user: employeeId })

  if (!employeeUser) {
    throw new UserInputError('User details not found')
  }

  const { startDate, endDate } = record
  let totalDays = moment(endDate).diff(moment(startDate), 'days')
  totalDays += 1

  record.leaveStatus = appendChar(status, 'D')

  if (record.leaveStatus === 'APPROVED') {
    employeeUser.availableLeaves -= totalDays
  }
  await record.save()
  await employeeUser.save()

  return { success: true, message: 'Status updated successfully' }
}

const getLeaveRecords = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null
  const { employeeId = '' } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await User.findOne({ token })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  let searchId = user._id
  if (user.role === 'HR' && employeeId) {
    searchId = employeeId
  }
  const records = await LeaveRecord.find({ user: searchId })
  return records
}
module.exports = {
  Query: {
    getLeaveRecords
  },
  Mutation: {
    createLeaveRecord,
    updateLeaveRecord
  }
}
