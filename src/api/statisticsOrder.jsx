import instance from "@/utils/request";

export const getStatisticsOrderApi = () => {
  return instance.get('/stats/order');
}