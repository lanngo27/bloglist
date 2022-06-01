import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createUser = async (name, username, password) => {
  const response = await axios.post(baseUrl, { name, username, password })
  return response.data
}

export default { getAll, createUser }
