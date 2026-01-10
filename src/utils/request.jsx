import axios from 'axios';
//统一的请求服务器地址
const instance = axios.create({
    baseURL:'http://8.137.157.16:9002'
})
export default instance;
