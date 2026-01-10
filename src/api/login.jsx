import instance from '@/utils/request';

export const loginApi = (data) => {
    console.log(data)
	return instance.post('/users/checkLogin',data)
}