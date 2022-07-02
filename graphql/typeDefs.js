const { gql } = require('apollo-server')

module.exports = gql`
  type Query {
    getAllUsers: [User!]
    getLeaveRecords(employeeId: String): [LeaveRecord!]
    getUser: User
  }

  type User {
    id: ID!
    token: String!
    name: String!
    email: String!
    phoneNumber: String!
    address: String!
    salary: String!
    designation: String!
    role: String!
    totalLeaves: Int!
    availableLeaves: Int!
    active: Boolean
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
    registerEmployee(
      name: String!
      email: String!
      phoneNumber: String!
      salary: String!
      designation: String!
      address: String!
    ): User!
    registerHR(
      name: String!
      email: String!
      phoneNumber: String!
      salary: String!
      designation: String!
      address: String!
      password: String!
    ): User!
    updatePassword(email: String!, password: String!, role: String!): Message
    loginUser(email: String!, password: String!, role: String): User!
    logoutUser: Message!
    updateLeaveRecord(employeeId: String!, status: String!): Message!
    createLeaveRecord(
      startDate: String!
      endDate: String!
      reason: String
    ): Message!
  }
`
