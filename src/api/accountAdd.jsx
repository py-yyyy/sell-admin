import instance from '../utils/request';

export const postAccountApi = (data) => {
    return instance.post('/users/add', data)
}
