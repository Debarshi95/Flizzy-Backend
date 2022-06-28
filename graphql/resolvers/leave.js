const { UserInputError } = require('apollo-server')
const LeaveRecord = require('../../models/Leave')
const User = require('../../models/User')

const createLeaveRecord = async (_, args, ctx) => {
  const { headers } = ctx.req
  const { startDate = '', endDate = '', reason = '' } = args
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
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
  const { userId = '', status } = args
  const token = headers?.authorization || null

  if (!token || !userId) {
    throw new UserInputError('Token or Id not provided')
  }

  const adminUser = await User.findOne({ token })

  if (!adminUser) {
    throw new UserInputError("User doesn't exist")
  }

  if (adminUser.role !== 'HR') {
    throw new UserInputError("You're not authorized to access this resource")
  }

  const otherUser = LeaveRecord.findOne({ user: userId })

  console.log({ otherUser })

  if (!otherUser) {
    throw new UserInputError('User details not found')
  }

  otherUser.leaveStatus = status
  await otherUser.save()

  return { success: true, message: 'Status updated successfully' }
}

const getLeaveRecords = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await User.findOne({ token })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  const records = await LeaveRecord.find({ user: user._id })
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
