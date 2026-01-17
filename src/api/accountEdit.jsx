import instance from "@/utils/request";

export const checkOldPwdApi = async(params) => {
    return instance.get('/users/checkoldpwd',{params});
}

export const editPwdApi = async(data) => {
    return instance.post('/users/editpwd',data);
}