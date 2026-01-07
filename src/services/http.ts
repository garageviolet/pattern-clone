import axios from 'axios'

const apiClient = axios.create({
  // Use relative URL so Vite's proxy handles CORS
  baseURL: '/api',
  timeout: 15_000,
})

export default apiClient

