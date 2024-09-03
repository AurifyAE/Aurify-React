import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
    'X-Secret-Key': process.env.REACT_APP_API_KEY
  },
  withCredentials: true,
});

export default axiosInstance;