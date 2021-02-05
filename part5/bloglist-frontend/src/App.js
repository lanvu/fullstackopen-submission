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
  const [notification, setNotification] = useState(null)
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
      notifyWith(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const notifyWith = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      notifyWith(`a new blog ${addedBlog.title} added`)
    } catch (error) {
      notifyWith(error.response.data.error, 'error')
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    } catch (error) {
      notifyWith(error.response.data.error, 'error')
    }
  }

  const deleteBlog = async (blogObject) => {
    const ok = window.confirm(
      `Remove ${blogObject.title} by ${blogObject.author}`
    )

    try {
      if (ok) {
        await blogService.remove(blogObject.id)
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
        notifyWith(`Deleted ${blogObject.title}`)
      }
    } catch (error) {
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
      notifyWith(`${blogObject.title} had already been removed`, 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name || user.username} logged in
        <button onClick={handleLogout}>logout</button>
        <br />
      </p>
      {blogForm()}
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          userId={user.id}
        />
      ))}
    </div>
  )
}

export default App
