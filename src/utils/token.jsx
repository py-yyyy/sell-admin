import { checkTokenApi } from '@/api/token';
import { message } from 'antd';

// 验证token有效性
export const checkToken = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
        return false;
    }

    const res = await checkTokenApi({ token: user.token });
    if (res.code === 0) {
        return true;
    }
    message.error(res.msg);
    localStorage.removeItem('user');
    return false;
};