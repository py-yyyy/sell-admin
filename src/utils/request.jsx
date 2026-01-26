import axios from 'axios';
export const serverURL = 'http://8.137.157.16:9002';

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
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);