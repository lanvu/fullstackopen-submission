const mongoose = require('mongoose')
const { schema: Author } = require('./author')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  published: {
    type: Number,
  },
  author: {
    type: Author,
    ref: 'Author',
  },
  genres: [{ type: String }],
})

module.exports = mongoose.model('Book', schema)
