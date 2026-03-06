import instance from '@/utils/request';

/**
 * 登录接口
 * @param {{account: string, password: string}}
 * @returns {Promise} 
 */
export const loginApi = (data) => {
	return instance.post('/users/checkLogin',data)
}