import React, { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const increaseLikes = () => {
    updateBlog(blog.id, { ...blog, likes: blog.likes + 1 })
    console.log({ ...blog, likes: blog.likes + 1 })
    blog.likes += 1
  }

  const details = () => (
    <>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={increaseLikes}>like</button>
      </div>
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
