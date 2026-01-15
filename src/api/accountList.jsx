import instance from '@/utils/request';

export const getAccountListApi = async(params) => {
    return instance.get('/users/list',{params})
}
export const editAccountApi = async(data) => {
    return instance.post('/users/edit',data)
}

export const delAccountApi = async(params) => {
    return instance.get('/users/del',{params})
}

export const batchDelAccountApi = async(params) => {
    return instance.get('/users/batchdel',{params})
}
