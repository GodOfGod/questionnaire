import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.DEV ? ' http://localhost:5173/api' : 'https://three-cats.top',
  // baseURL: import.meta.env.DEV ? ' http://localhost:5173/api' : 'http://localhost:8080',
})

instance.interceptors.response.use((response) => {
  return Object.assign(response, { data: response.data.data })
})

export default instance
