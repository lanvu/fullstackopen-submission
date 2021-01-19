import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import {
  initializeBlogs,
  createBlog,
  deleteBlog,
  incrementLikeOf,
} from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import userService from './services/users'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  const background = {
    backgroundColor: 'lightgray',
  }
  return (
    <div style={background}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user.name || user.username} logged in{' '}
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

const UserList = ({ users }) => {
  return (
    <div>
      <h1>Users</h1>
      <table>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

const UserView = ({ user, blogs }) => {
  if (!user || !blogs) {
    return null
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map((blogId) => (
          <li key={blogId}>{blogs.find((blog) => blog.id === blogId).title}</li>
        ))}
      </ul>
    </div>
  )
}

const BlogView = ({ user, blog, increaseLikes }) => {
  if (!user || !blog) {
    return null
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={increaseLikes}>like</button>
      </div>
      <div>added by {user.name}</div>
    </div>
  )
}

const App = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const blogFormRef = useRef()
  const {
    blogs,
    user,
    setUser,
    setNotification,
    initializeBlogs,
    createBlog,
    deleteBlog,
    incrementLikeOf,
  } = props

  useEffect(() => {
    initializeBlogs()
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON && loggedUserJSON !== 'undefined') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    const fetchUsers = async () => {
      const response = await userService.getAll()
      setUsers(response)
    }
    fetchUsers()
  }, [initializeBlogs, setUser])

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
      setNotification(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      createBlog(blog)
      setNotification(`a new blog ${blog.title} added`)
    } catch (error) {
      setNotification(error.response.data.error, 'error')
    }
  }

  const like = (blog) => {
    incrementLikeOf(blog)
    setNotification(`you liked '${blog.title}'`, 5)
  }

  const removeBlog = (blog) => {
    const ok = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    try {
      if (ok) {
        deleteBlog(blog)
        setNotification(`Deleted ${blog.title}`)
      }
    } catch (error) {
      setNotification(error.response.data.error, 'error')
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

  const matchUser = useRouteMatch('/users/:id')
  const userFound = matchUser
    ? users.find((u) => u.id === matchUser.params.id)
    : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const blogFound = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <h2>blogs</h2>
      <Notification />
      <Switch>
        <Route path="/users/:id">
          <UserView user={userFound} blogs={blogs} />
        </Route>
        <Route path="/users">
          <UserList users={users} />
        </Route>
        <Route path="/blogs/:id">
          <BlogView
            user={user}
            blog={blogFound}
            increaseLikes={() => {
              like(blogFound)
            }}
          />
        </Route>
        <Route path="/">
          {blogForm()}
          <ul>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </ul>
        </Route>
      </Switch>
    </div>
  )
}

const mapStateToProps = (state) => ({
  blogs: state.blogs.sort((l, r) => r.likes - l.likes),
  user: state.user,
})

const mapDispatchToProps = {
  setUser,
  setNotification,
  initializeBlogs,
  createBlog,
  deleteBlog,
  incrementLikeOf,
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
