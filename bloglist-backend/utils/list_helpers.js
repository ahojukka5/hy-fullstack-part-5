const dummy = () => {
  // ...
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((s, b) => s + b.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    throw new Error(
      'To determine favorite blog post, list of blogs cannot be empty.'
    )
  }
  const maxLikes = blogs.reduce((m, b) => Math.max(m, b.likes), 0)
  const favoriteBlogs = blogs.filter(blog => blog.likes === maxLikes)
  if (favoriteBlogs.length > 1) {
    console.warn(
      `More than one blog has ${maxLikes} likes, returning first one from list`
    )
  }
  const favoriteBlog = favoriteBlogs[0]
  return {
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
    title: favoriteBlog.title
  }
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    throw new Error(
      'To determine author of most blogs, list of blogs cannot be empty.'
    )
  }
  let authors = {}
  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
  })
  const author = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )
  return { author, blogs: authors[author] }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    throw new Error(
      'To determine author of most likes, list of blogs cannot be empty.'
    )
  }
  let authors = {}
  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
  })
  const author = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )
  return { author, likes: authors[author] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
