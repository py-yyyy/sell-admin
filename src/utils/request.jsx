import axios from 'axios';
import { checkToken } from '@/utils/token';
// export const serverURL = 'http://8.137.157.16:9002';
export const serverURL = 'https://api-admin.wled.top/api';

//统一的请求服务器地址
const instance = axios.create({
  baseURL: serverURL,
  timeout: 60000,
})
export default instance;

instance.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  response => {
    return response.data;
  },
   async error => {
    if (error.response && error.response.status === 401 || await checkToken() === false) {
      localStorage.removeItem('user');
      // window.location.href = '/login';
      const base = import.meta.env.BASE_URL || '/';
      window.location.href = `${base}login`;
    }
    return Promise.reject(error);
  }
);