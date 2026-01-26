import instance from "@/utils/request";

export const getShopInfoApi = () => {
    return instance.get('/shop/info');
}

export const uploadShopImgApi = (data) => {
    return instance.post('/shop/upload',data);
}

export const editShopInfoApi = (data) => {
    return instance.post('/shop/edit',data);
}