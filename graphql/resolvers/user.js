const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { JWT_SECRET } = require('../../config/constants')
const User = require('../../models/User')
const {
  validateLogin,
  validateHR,
  validateEmployee
} = require('../../utils/validators')
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

  return users
}

const loginUser = async (_, args) => {
  const { errors, valid } = validateLogin(args)
  const { role = 'EMP', email, password } = args

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UserInputError("User doesn't exist")
  }

  if (user.role !== role) {
    throw new UserInputError("You're not authorized to access this resource")
  }
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new UserInputError('Email or password incorrect')
  }

  const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  })

  user.token = token

  await user.save()

  const {
    _id,
    email: userEmail,
    name,
    role: userRole,
    address,
    token: userToken,
    phoneNumber,
    designation,
    salary,
    availableLeaves,
    totalLeaves,
    active
  } = user

  return {
    token: userToken,
    id: _id,
    email: userEmail,
    name,
    address,
    phoneNumber,
    designation,
    salary,
    role: userRole,
    availableLeaves,
    totalLeaves,
    active
  }
}

const registerEmployee = async (_, args) => {
  const { errors, valid } = validateEmployee(args)

  const { name, email, phoneNumber, address, salary, designation } = args

  const role = 'EMP'

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    throw new UserInputError('User already exists with given email')
  }

  const user = new User({
    name,
    email,
    phoneNumber,
    role,
    address,
    designation,
    password: '',
    salary
  })

  await user.save()

  if (role === 'EMP') {
    const mailBody = generateMailBody(email, name)
    await mailTransporter.sendMail(mailBody)
  }

  return {
    token: user?.token || '',
    id: user._id,
    email: user.email,
    name: user.name,
    address: user.address,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    salary: user.salary,
    role: user.role,
    active: user.active,
    availableLeaves: user.availableLeaves,
    totalLeaves: user.totalLeaves
  }
}

const registerHR = async (_, args) => {
  const { errors, valid } = validateHR(args)

  const {
    name,
    email,
    phoneNumber,
    address,
    salary,
    designation,
    password = ''
  } = args

  const role = 'HR'

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    throw new UserInputError('User already exists with given email')
  }

  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  const user = new User({
    name,
    email,
    phoneNumber,
    role,
    address,
    designation,
    password: passwordHash,
    salary
  })

  await user.save()

  const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  })

  user.token = token
  user.active = true

  await user.save()

  return {
    token: user.token,
    id: user._id,
    email: user.email,
    name: user.name,
    address: user.address,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    salary: user.salary,
    role: user.role,
    availableLeaves: user.availableLeaves,
    totalLeaves: user.totalLeaves,
    active: user.active
  }
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
  user.active = true
  await user.save()

  return {
    success: true,
    message: 'Password updated Successfully'
  }
}

const logoutUser = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await User.findOne({ token })

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

const getUser = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await User.findOne({ token })

  if (!user) {
    throw new UserInputError('User not found')
  }

  const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '7d'
  })

  user.token = newToken
  await user.save()

  const {
    _id,
    email,
    name,
    role,
    address,
    token: userToken,
    phoneNumber,
    designation,
    salary,
    availableLeaves,
    totalLeaves,
    active
  } = user

  return {
    token: userToken,
    id: _id,
    email,
    name,
    address,
    phoneNumber,
    designation,
    salary,
    role,
    availableLeaves,
    totalLeaves,
    active
  }
}

module.exports = {
  Query: {
    getAllUsers,
    getUser
  },
  Mutation: {
    registerHR,
    registerEmployee,
    loginUser,
    logoutUser,
    updatePassword
  }
}
