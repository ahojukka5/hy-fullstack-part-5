import React, { useState, useEffect, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import { useField } from './hooks'

const CreateBlogForm = props => {
  const { onSubmit, title, author, url } = props
  // https://codeburst.io/react-anti-pattern-jsx-spread-attributes-59d1dd53677f
  return (
    <form onSubmit={onSubmit}>
      <div>
        title: <input {...title} reset="" />
      </div>
      <div>
        author: <input {...author} reset="" />
      </div>
      <div>
        url: <input {...url} reset="" />
      </div>
      <div>
        <button>create</button>
      </div>
    </form>
  )
}

CreateBlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired
}

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

function App() {
  const username = useField('text')
  const password = useField('password')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [ready, setReady] = useState(false)
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const createBlogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBloglistUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
    setReady(true)
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      console.log('user', user)
      setUser(user)
      blogService.setToken(user.token)
      // setErrorMessage(`welcome, ${user.name}!`);
      // setTimeout(() => setErrorMessage(null, 5000));
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
    } catch (error) {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
    username.reset()
    password.reset()
  }

  // prettier-ignore
  const handleLogout = async event => { // eslint-disable-line no-unused-vars
    setUser(null)
    localStorage.removeItem('loggedBloglistUser')
  }

  const handleCreateBlog = async event => {
    event.preventDefault()
    const blog = await blogService.create({
      title: title.value,
      author: author.value,
      url: url.value
    })
    setBlogs(blogs.concat(blog))
    title.reset()
    author.reset()
    url.reset()
    console.log('createBlogFormRef', createBlogFormRef)
    try {
      createBlogFormRef.current.toggleVisibility()
    } catch (error) {
      // Reason: unknown!
      console.log('Unable to toggle visiblity', error)
    }
    setErrorMessage('New blog added succesfully!')
    setTimeout(() => setErrorMessage(null), 5000)
  }

  if (!ready) {
    return <h1>Loading app</h1>
  }

  // https://codeburst.io/react-anti-pattern-jsx-spread-attributes-59d1dd53677f
  if (!user) {
    return (
      <div className="App">
        <div>{errorMessage}</div>
        <h1> Login to application </h1>
        <form onSubmit={handleLogin}>
          <div>
            username <input {...username} reset="" />
          </div>
          <div>
            password <input {...password} reset="" />
          </div>
          <div>
            <button>login</button>
          </div>
        </form>
      </div>
    )
  }

  const likeFactory = blog => {
    return async () => {
      await blogService.update(blog, {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
      setBlogs(
        blogs
          .map(b => (b.id === blog.id ? { ...blog, likes: blog.likes + 1 } : b))
          .sort((a, b) => b.likes - a.likes)
      )
    }
  }

  const deleteFactory = blog => {
    return async () => {
      if (window.confirm(`Delete blog ${blog.title}?`)) {
        await blogService.delete(blog)
        setBlogs(blogs.filter(b => blog.id !== b.id))
      }
    }
  }

  const blogList = () =>
    blogs.map(blog => {
      return (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={likeFactory(blog)}
          onDelete={deleteFactory(blog)}
          user={user}
        />
      )
    })

  return (
    <div className="App">
      <div>{errorMessage}</div>
      <h1>Blogs</h1>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      {blogList()}

      <h1>Create new blog</h1>
      <Togglable buttonLabel="New blog" ref={createBlogFormRef}>
        <CreateBlogForm
          onSubmit={handleCreateBlog}
          title={title}
          author={author}
          url={url}
        />
      </Togglable>
    </div>
  )
}

export default App
