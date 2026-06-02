import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
})

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()

      authStore.logout()

      if (router.currentRoute.value.name !== 'login') {
        await router.push({
          name: 'login',
          query: {
            reason: 'expired',
          },
        })
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
