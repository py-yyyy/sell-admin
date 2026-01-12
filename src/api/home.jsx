import instance from "@/utils/request";

export const getHomeDataApi = () => {
    return instance.get('/stats/total')
}