import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true, // Ensure cookies are sent with all requests
});

export default instance;