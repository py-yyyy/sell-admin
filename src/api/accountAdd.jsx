import instance from '../utils/request';

export const getAccountInfoApi = (params) => {
    return instance.get('/users/accountinfo', { params })
}
