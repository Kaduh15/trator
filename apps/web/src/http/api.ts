import { env } from '@trator/env/web'
import axios from 'axios'

const api = axios.create({
  baseURL: env.VITE_SERVER_URL,
  withCredentials: true,
})

export { api }
