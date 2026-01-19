import instance from "@/utils/request";

export const getGoodsItemInfoApi = async (params) => {
  return instance.get('/goods/info',{params});
}

export const uploadGoodsImgApi = async (formData) => {
  return instance.post('/goods/goods_img_upload',formData);
}

export const editGoodsItemApi = async (data) => {
  return instance.post('/goods/edit',data);
}