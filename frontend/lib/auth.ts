import Cookies from 'js-cookie'
import { authAPI } from './api'

export const setAuthToken = (token: string) => {
  Cookies.set('access_token', token, { 
    expires: 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  console.log('Token saved in cookies')
}

export const getAuthToken = (): string | undefined => {
  return Cookies.get('access_token')
}

export const removeAuthToken = () => {
  Cookies.remove('access_token')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

export const login = async (email: string, password: string) => {
  const response = await authAPI.login({ email, password })
  const { access_token } = response.data
  if (access_token) {
    setAuthToken(access_token)
    console.log('Token saved:', access_token.substring(0, 20) + '...')
  } else {
    console.error('Token not received in response')
  }
  return response.data
}

export const register = async (
  email: string,
  username: string,
  password: string,
  fullName?: string
) => {
  const response = await authAPI.register({ email, username, password, full_name: fullName })
  return response.data
}

export const logout = () => {
  removeAuthToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

