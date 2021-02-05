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
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { params, token } = request

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await Blog.findByIdAndRemove(params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { params, body, token } = request

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
    })

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  const { params, body, token } = request

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const oldBlog = await Blog.findById(params.id)
    oldBlog.comments.push(body.comment)
    const updatedBlog = await Blog.findByIdAndUpdate(params.id, oldBlog, {
      new: true,
    })

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
