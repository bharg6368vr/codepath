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
// session and send the user back to login instead of leaving them stuck
// on a page that silently fails every request.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint && localStorage.getItem('codepath_token')) {
      localStorage.removeItem('codepath_token')
      localStorage.removeItem('codepath_user')
      const base = import.meta.env.BASE_URL || '/'
      const loginPath = base.endsWith('/') ? `${base}login` : `${base}/login`
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath
      }
    }
    return Promise.reject(error)
  }
)

export default client
