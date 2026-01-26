import instance from "@/utils/request";
export const checkTokenApi = (params) =>{
    return instance.get('/users/checktoken', { params })
}