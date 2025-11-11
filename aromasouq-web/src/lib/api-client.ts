import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_URL } from './constants'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true, // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login only if not already on public/auth pages
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            const publicPaths = ['/login', '/register', '/become-vendor']
            const isPublicPath = publicPaths.some(path => currentPath.startsWith(path))
            if (!isPublicPath) {
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  // POST request
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  // PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  // PATCH request
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }

  // DELETE request
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }

  // File upload
  async uploadFile<T>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Multiple file upload
  async uploadFiles<T>(url: string, files: File[], fieldName: string = 'files'): Promise<T> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append(fieldName, file)
    })

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
