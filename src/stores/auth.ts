import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/authApi'

const TOKEN_KEY = 'accessToken'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => accessToken.value !== null)

  async function login(username: string, password: string) {
    const response = await loginApi({
      username,
      password,
    })

    accessToken.value = response.token
    localStorage.setItem(TOKEN_KEY, response.token)
  }

  function logout() {
    accessToken.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    accessToken,
    isAuthenticated,
    login,
    logout,
  }
})
