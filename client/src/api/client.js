import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL || '/api'
const client = axios.create({
  baseURL: rawBaseUrl,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('codepath_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the server rejects our token (expired/invalid), clear the stale
// session so ProtectedRoute will handle returning to login within the SPA.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/') || error.config?.url?.includes('/auth/')
    const token = localStorage.getItem('codepath_token')
    if (error.response?.status === 401 && !isAuthEndpoint && token && token !== 'offline_session_token') {
      localStorage.removeItem('codepath_token')
      localStorage.removeItem('codepath_user')
    }
    return Promise.reject(error)
  }
)

export default client
