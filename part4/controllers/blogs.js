const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const { body, token } = request
  const { title, url, likes } = body

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!title || !url) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
      ...request.body,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const { params, token } = request
  const blog = await Blog.findById(params.id)

  if (token && blog.user.toString() === token.id.toString()) {
    await Blog.findByIdAndRemove(params.id)
    response.status(204).end()
  } else {
    response.status(400).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true
    }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
