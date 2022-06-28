const userResolver = require('./user')
const leaveResolver = require('./leave')

module.exports = {
  Query: {
    ...userResolver.Query,
    ...leaveResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...leaveResolver.Mutation
  }
}
