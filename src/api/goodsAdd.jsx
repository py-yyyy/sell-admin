import instance from "@/utils/request";

export const addGoodsApi = async (data) => {
  return instance.post('/goods/add', data);
}