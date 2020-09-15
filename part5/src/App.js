import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    status: null,
    message: '',
  })
  const blogFormRef = useRef()

  const getAllBlogs = async () => {
    const initialBlogs = await blogService.getAll()
    setBlogs(initialBlogs)
  }

  useEffect(() => {
    getAllBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON && loggedUserJSON !== 'undefined') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification({
        status: 'error',
        message: error.response.data.error,
      })
      resetNotification()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const resetNotification = () => {
    setTimeout(() => {
      setNotification({
        status: null,
        message: '',
      })
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setNotification({
        status: 'success',
        message: `a new blog ${addedBlog.title} added`,
      })
      resetNotification()
    } catch (error) {
      setNotification({
        status: 'error',
        message: error.response.data.error,
      })
      resetNotification()
    }
  }

  const updateBlog = async (blogId, blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogId, blogObject)
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    } catch (error) {
      setNotification({
        status: 'error',
        message: error.response.data.error,
      })
      resetNotification()
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification {...notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification {...notification} />
      <p>
        {user.name || user.username} logged in
        <button onClick={handleLogout}>logout</button>
        <br />
      </p>

      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
      ))}
    </div>
  )
}

export default App
