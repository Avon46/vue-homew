import axios from 'axios'
import type { LoginRequest, LoginResponse } from '@/types/auth'

const API_BASE_URL = 'http://localhost:8080'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, request)

  return response.data
}
