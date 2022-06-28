const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    getAllUsers: [User!]
    getLeaveRecords: [LeaveRecord!]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
    salary: String
    designation: String
    role: String
  }

  type LeaveRecord {
    reason: String
    startDate: String!
    endDate: String!
    leaveStatus: String!
  }

  type AuthResponse {
    id: ID!
    token: String!
  }

  type Message {
    message: String
    success: Boolean
  }

  type Mutation {
    registerUser(
      name: String!
      email: String!
      role: String!
      phoneNumber: String!
      password: String!
      confirmPassword: String!
    ): Message
    updatePassword(
      email: String!
      password: String!
      role: String!
    ): AuthResponse
    loginUser(email: String!, password: String!, role: String!): AuthResponse
    logoutUser: Message!
    updateLeaveRecord(userId: String!, status: String!): Message!
    createLeaveRecord(
      startDate: String!
      endDate: String!
      reason: String
    ): Message!
  }
`
