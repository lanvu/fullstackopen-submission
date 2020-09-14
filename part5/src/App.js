import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const Input = ({ label, value, onChange }) => {
  return (
    <div>
      {label}
      <input value={value} onChange={onChange} />
    </div>
  )
}

const Notification = ({ status, message }) => {
  if (status === null) {
    return null
  } else if (status === 'error') {
    return <div className="error">{message}</div>
  } else {
    return <div className="success">{message}</div>
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState({
    status: null,
    message: '',
  })

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

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const addedBlog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })
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

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
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
    <form onSubmit={addBlog}>
      <Input label={'title:'} value={newTitle} onChange={handleTitleChange} />
      <Input
        label={'author:'}
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      <Input label={'url:'} value={newUrl} onChange={handleUrlChange} />
      <button type="submit">create</button>
    </form>
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

      <h2>create new</h2>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
