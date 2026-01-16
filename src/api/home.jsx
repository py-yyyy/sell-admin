import instance from "@/utils/request";

export const getHomeDataApi = () => {
    return instance.get('/stats/total')
}

export const getAccountInfoApi = (params) => {
    return instance.get('/users/accountinfo', { params })
}