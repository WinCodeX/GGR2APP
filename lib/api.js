import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gg-t4.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
