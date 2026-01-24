import instance from "@/utils/request";

export const getOrderListApi = async (params) => {
  return instance.get('/order/list', { params });
}

export const getOrderDetailApi = async (params) => {
  return instance.get('/order/detail', { params });
}

export const editOrderApi = async (data) => {
  return instance.post('/order/edit', data);
}