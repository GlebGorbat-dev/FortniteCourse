import axios from 'axios'
import Cookies from 'js-cookie'


// Get API URL from environment variable
// In production on Render, this is set via NEXT_PUBLIC_API_URL env var
// During build, Next.js embeds this value into the client bundle
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Log API URL in development to help debug
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API] Using API URL:', API_URL)
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config: any) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: true,
      tokenPreview: token.substring(0, 20) + '...',
      authHeader: `Bearer ${token.substring(0, 20)}...`
    })
  } else {
    console.warn('[API Request] No token in cookies for request:', config.url)
  }
  return config
})

// Error handling interceptor
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      const token = Cookies.get('access_token')
      console.error('[API Error] 401 Unauthorized')
      console.error('URL:', error.config?.url)
      console.error('Method:', error.config?.method)
      console.error('Error details:', error.response?.data)
      console.error('Token in cookies:', token ? 'present' : 'missing')
      if (token) {
        console.error('Token (first 30 chars):', token.substring(0, 30) + '...')
        console.error('Authorization header was sent:', error.config?.headers?.Authorization ? 'yes' : 'no')
        if (error.config?.headers?.Authorization) {
          console.error('Authorization header:', error.config.headers.Authorization.substring(0, 50) + '...')
        }
      }
      
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      if (!currentPath.includes('/platform')) {
        console.log('[API] Removing token due to 401 error (not on platform)')
        Cookies.remove('access_token')
      } else {
        console.log('[API] 401 on platform - not removing token, let component handle')
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    api.post('/api/v1/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', data),
  getMe: () => api.get('/api/v1/auth/me'),
}

// Courses API
export const coursesAPI = {
  getCourses: (skip = 0, limit = 100) =>
    api.get(`/api/v1/courses/?skip=${skip}&limit=${limit}`),
  getCourse: (courseId: number) =>
    api.get(`/api/v1/courses/${courseId}`),
}

// Account API
export const accountAPI = {
  getAccount: () => api.get('/api/v1/account/me'),
  getCourses: () => api.get('/api/v1/account/courses'),
  getProgress: (courseId: number) =>
    api.get(`/api/v1/account/progress/${courseId}`),
}

// Progress API
export const progressAPI = {
  updateProgress: (data: { lesson_id: number; watched_duration: number; is_completed?: boolean }) =>
    api.post('/api/v1/progress/update', data),
  getLessonProgress: (lessonId: number) =>
    api.get(`/api/v1/progress/lesson/${lessonId}`),
}

// Resources API
export const resourcesAPI = {
  getCourseResources: (courseId: number) =>
    api.get(`/api/v1/resources/course/${courseId}`),
}

export default api

