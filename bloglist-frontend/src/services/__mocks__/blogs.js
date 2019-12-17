const blogs = [
  {
    id: '5a451df7571c224a31b5c8ce',
    author: 'John Doe',
    title: 'Who is John Doe anyway?',
    url: 'https://en.wikipedia.org/wiki/John_Doe',
    likes: 5,
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'test',
      name: 'Test User'
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

const setToken = newToken => {
  console.log('set token ', newToken)
}

export default { getAll, setToken }
