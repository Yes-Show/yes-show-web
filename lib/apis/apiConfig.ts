import axios from "axios"

const BASE_URL = "https://yes-show-api-production.up.railway.app"

export const api = axios.create({ baseURL: BASE_URL })
