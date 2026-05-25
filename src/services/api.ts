import axios from 'axios'

const api = axios.create({
  baseURL: 'https://vizhuthugal-dashboard.onrender.com',
})

export default api