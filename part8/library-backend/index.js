const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const config = require('./config')
const Book = require('./models/book')
const Author = require('./models/author')

mongoose
  .connect(config.MONGODB_URI, {
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

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, born: Int!): Author
  }
`

const resolvers = {
  Author: {
    bookCount: (root) =>
      Book.collection.countDocuments({ 'author.name': root.name }),
  },

  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({})
      } else if (!args.author) {
        return Book.find({ genres: args.genre })
      } else if (!args.genre) {
        return Book.find({ author: args.author })
      } else {
        return Book.find({ author: args.author, genres: args.genre })
      }
    },
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => Author.find({}),
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const book = new Book({ ...args, author })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.born
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
