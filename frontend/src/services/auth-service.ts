export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

const API_BASE = "http://localhost:3001/api"

export async function login(email: string, password: string): Promise<AuthResponse> {

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Login failed")
  }

  const data = await res.json()

  localStorage.setItem("authToken", data.token)
  localStorage.setItem("authUser", JSON.stringify(data.user))

  return data
}

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {

  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Signup failed")
  }

  const data = await res.json()

  localStorage.setItem("authToken", data.token)
  localStorage.setItem("authUser", JSON.stringify(data.user))

  return data
}

export async function logout(): Promise<void> {

  localStorage.removeItem("authToken")
  localStorage.removeItem("authUser")

}

export function getCurrentUser(): AuthUser | null {

  const raw = localStorage.getItem("authUser")

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }

}

export function getToken(): string | null {
  return localStorage.getItem("authToken")
}