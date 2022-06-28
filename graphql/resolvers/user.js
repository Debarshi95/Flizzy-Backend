const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { JWT_SECRET } = require('../../config/constants')
const User = require('../../models/User')
const { validateLogin, validateRegister } = require('../../utils/validators')
const { mailTransporter, generateMailBody } = require('../../utils/mailer')

const getAllUsers = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await User.findOne({ token })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  if (user.role !== 'HR') {
    throw new UserInputError("You're not authorized to access this resource")
  }

  const users = await User.find()
  console.log({ users })
  return users
}

const loginUser = async (_, args) => {
  const { errors, valid } = validateLogin(args)

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const user = await User.findOne({ email: args.email })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  if (user.role !== args.role) {
    throw new UserInputError("You're not authorized to access this resource")
  }
  const passwordMatch = await bcrypt.compare(args.password, user.password)

  if (!passwordMatch) {
    throw new UserInputError('Email or password incorrect')
  }

  const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  })

  user.token = token

  await user.save()

  return { token, id: user._id }
}

const registerUser = async (_, args) => {
  const { errors, valid } = validateRegister(args)

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  if (args.role !== 'HR') {
    throw new UserInputError("You're not allowed to access this resource")
  }
  const userExists = await User.findOne({ email: args.email })

  if (userExists) {
    throw new UserInputError('User already exists with given email')
  }

  const user = new User({
    name: args.name,
    email: args.email,
    phoneNumber: args.phoneNumber,
    role: 'EMP',
    designation: args?.designation || '',
    salary: args?.salary || ''
  })

  await user.save()

  const mailBody = generateMailBody(args.email)

  await mailTransporter.sendMail(mailBody)

  return { success: true, message: 'User created successfully' }
}

const updatePassword = async (_, args) => {
  const { errors, valid } = validateLogin(args)

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const user = await User.findOne({ email: args.email })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  if (args.role !== 'EMP') {
    throw new UserInputError("You're not allowed to access this resource")
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(args.password, saltRounds)

  user.password = passwordHash
  user.active = true

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  })

  user.token = token
  await user.save()

  return { token, id: user._id }
}

const logoutUser = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = User.findOne({ token })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  user.token = null

  await user.save()

  return {
    success: true,
    message: 'Logged out successfully!'
  }
}

module.exports = {
  Query: {
    getAllUsers
  },
  Mutation: {
    registerUser,
    loginUser,
    logoutUser,
    updatePassword
  }
}
