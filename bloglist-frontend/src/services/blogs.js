import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = 'Bearer ' + newToken
}

const getToken = () => token

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async ({ title, author, url }) => {
  const response = await axios.post(
    baseUrl,
    { title, author, url },
    { headers: { Authorization: getToken() } }
  )
  return response.data
}

const update = async (blog, data) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, data, config)
  return response.data
}

const delete_ = async blog => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, create, update, delete: delete_, setToken }
