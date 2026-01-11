import instance from '@/utils/request';

export const loginApi = (data) => {
	return instance.post('/users/checkLogin',data)
}