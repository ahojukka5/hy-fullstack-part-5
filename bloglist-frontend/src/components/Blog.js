import React, { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [expanded, setExpanded] = useState(false)
  const showDeleteButton = () => {
    if (!blog.user || blog.user.username === user.username) {
      return (
        <div>
          <button onClick={onDelete}>delete</button>
        </div>
      )
    }
  }
  if (expanded) {
    return (
      <div style={blogStyle}>
        <div onClick={() => setExpanded(!expanded)}>
          {blog.title} {blog.author}
        </div>
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            {blog.likes} likes <button onClick={onLike}>like</button>
          </div>
          <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
          {showDeleteButton()}
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div onClick={() => setExpanded(!expanded)}>
          {blog.title} {blog.author}
        </div>
      </div>
    )
  }
}

export default Blog
