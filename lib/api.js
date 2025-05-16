import axios from 'axios';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

// Environment detection
const isDev = __DEV__;

// Localhost fallback (adjust port if needed)
const localURL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000/api/v1'
  : 'http://localhost:3000/api/v1';

// Live backend
const productionURL = 'https://gg-t4.onrender.com/api/v1';

// Use dev or prod base URL
const baseURL = isDev ? localURL : productionURL;

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