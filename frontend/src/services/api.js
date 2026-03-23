const API_BASE = "http://localhost:3001/api"

export const apiFetch = async (endpoint, options = {}) => {

  const token = localStorage.getItem("authToken")

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Request failed")
  }

  return res.json()
}