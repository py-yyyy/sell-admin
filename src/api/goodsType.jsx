import instance from "@/utils/request";

export const getGoodsCategoriesApi = async () => {
  return instance.get('/goods/categories');
}

export const getGoodsTypesListApi = async (params) => {
  return instance.get('/goods/catelist', { params });
}

export const deleteGoodsTypeApi = async (params) => {
  return instance.get('/goods/delcate', { params });
}

export const editGoodsTypeApi = async (data) => {
  return instance.post('/goods/editcate', data);
}

export const addGoodsTypeApi = async (data) => {
  return instance.post('/goods/addcate', data);
}