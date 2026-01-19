import instance from "@/utils/request";

export const getGoodsListApi = async (params) => {
  return instance.get('/goods/list', { params });
}

export const delGoodsItemApi = async (params) => {
  return instance.get('/goods/del',{params});
}