// src/lib/axios.ts
import axios from 'axios'

export const BASE_URL = 'http://localhost:3000/api'
const FILE_URL = 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: BASE_URL,
	withCredentials: true,
})

export const fileApi = axios.create({
  baseURL: FILE_URL,
  withCredentials: true,
})