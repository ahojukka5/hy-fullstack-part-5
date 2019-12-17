import axios from 'axios'
const baseUrl = '/api/login'

const login = async props => {
  const response = await axios.post(baseUrl, {
    username: props.username.value,
    password: props.password.value
  })
  return response.data
}

export default { login }
