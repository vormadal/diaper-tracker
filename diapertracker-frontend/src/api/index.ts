import axios from 'axios'
import { ApiClient } from './ApiClient'

const url = process.env.NODE_ENV === 'production' ? window.location.origin : 'https://localhost:6011'
export const Api = new ApiClient(
  url,
  axios.create({
    withCredentials: true
  })
)
