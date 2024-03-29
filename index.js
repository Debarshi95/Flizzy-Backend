const { ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground
} = require('apollo-server-core')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const { PORT } = require('./config/constants')
const connectToDB = require('./utils/connect-to-db')

const app = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  cache: 'bounded',
  csrfPrevention: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: (context) => context
})

connectToDB()
app.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server started at port ${url}`)
})
