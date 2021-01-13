import React, { useState } from 'react'

const Blog = ({ blog, removeBlog, increaseLikes, userId }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const removeButtonStyle = {
    backgroundColor: 'dodgerblue',
  }

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const details = () => (
    <>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={increaseLikes}>like</button>
      </div>
      {userId === blog.user && (
        <button onClick={removeBlog} style={removeButtonStyle}>
          remove
        </button>
      )}
    </>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && details()}
    </div>
  )
}

export default Blog
