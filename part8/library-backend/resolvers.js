const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

module.exports = {
  Author: {
    bookCount: (root) => Book.countDocuments({ author: root._id }),
  },

  Query: {
    bookCount: () => Book.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      const query = {}

      if (author) {
        const authorFound = await Author.findOne({ name: author })
        query.author = authorFound.id
      }

      if (genre) {
        query.genres = { $in: [genre] }
      }

      return Book.find(query).populate('author')
    },
    authorCount: () => Author.countDocuments(),
    allAuthors: () => Author.find({}),
    me: (root, args, { currentUser }) => {
      return currentUser
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      let book = new Book({ ...args, author })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: { ...args, author },
        })
      }
      book = await Book.findById(book.id).populate('author')

      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.born

      return author.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    createUser: (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secred') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}
