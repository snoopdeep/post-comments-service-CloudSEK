import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, // keep this if authentication with cookies is needed
});

export default api;
