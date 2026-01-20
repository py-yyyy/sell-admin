import instance from "@/utils/request";

export const getGoodsCategoriesApi = async () => {
  return instance.get('/goods/categories');
}