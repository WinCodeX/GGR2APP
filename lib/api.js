import axios from 'axios';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

// Define base URL (Render)
const baseURL = 'https://gg-t4.onrender.com/api/v1';

// Create API instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Toast-based error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Unable to reach the server. Please try again later.',
      });
    }
    return Promise.reject(error);
  }
);

export default api;