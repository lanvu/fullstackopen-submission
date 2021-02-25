const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const DataLoader = require('dataloader')
const { MONGODB_URI, JWT_SECRET } = require('./config')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const User = require('./models/user')
const Book = require('./models/book')

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const context = {}

    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      context.currentUser = await User.findById(decodedToken.id)
    }

    context.bookLoader = new DataLoader(async (keys) => {
      const books = await Book.find({
        author: {
          $in: keys,
        },
      })
      return keys.map(
        (key) => books.filter((b) => String(b.author) === String(key)).length
      )
    })

    return context
  },
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
