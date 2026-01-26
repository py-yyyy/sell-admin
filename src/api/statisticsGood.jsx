import instance from "@/utils/request";

export const getStatisticsGoodApi = () => {
    return instance.get('/stats/goods');
}