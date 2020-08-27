const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  let likes = 0

  blogs.forEach(blog => {
    likes += blog.likes
  })

  return likes
}

const favoriteBlog = blogs => {
  let maxLikes = 0
  let blogWithMaxLikes = null

  blogs.forEach(blog => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      const { title, author, likes } = blog
      blogWithMaxLikes = { title, author, likes }
    }
  })

  return blogWithMaxLikes
}

const mostLikes = blogs => {
  const authors = new Map()
  let maxLikes = 0
  let authorWithMaxLikes = null

  blogs.forEach(blog => {
    if (authors.has(blog.author)) {
      const likes = authors.get(blog.author)
      authors.set(blog.author, likes + blog.likes)
    } else {
      authors.set(blog.author, blog.likes)
    }
  })

  console.log(authors)

  authors.forEach((likes, author) => {
    if (likes > maxLikes) {
      maxLikes = likes
      authorWithMaxLikes = author
    }
  })

  return { author: authorWithMaxLikes, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes
}
