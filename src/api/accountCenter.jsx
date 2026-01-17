import instance from "@/utils/request";

export const getAccountCenterApi = async(params) => {
    return instance.get('/users/accountinfo',{params});
}

export const uploadAvatarApi = async(formData) => {
    return instance.post('/users/avatar_upload', formData);
}

export const updateAvatarApi = async(params) => {
    return instance.get('/users/avataredit', {params});
}