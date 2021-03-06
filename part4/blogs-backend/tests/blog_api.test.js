const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogsObject.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id property exists', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Lan Vu',
    url: 'lanvu.com'
  }

  const token = await helper.getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('async/await simplifies making async calls')
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Lan Vu',
    url: 'lanvu.com'
  }

  const token = await helper.getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[helper.initialBlogs.length].likes).toBe(0)
})

test('a blog without title or url returns 400', async () => {
  const newBlog = {
    author: 'Lan Vu'
  }

  const token = await helper.getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog without token returns 401', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Lan Vu',
    url: 'lanvu.com'
  }

  await api.post('/api/blogs').send(newBlog).expect(401)
})

afterAll(() => {
  mongoose.connection.close()
})
