import PageHeader from '@/components/pageHeader/pageHeader';
import style from './goods.module.scss';
import { getStatisticsGoodApi } from '@/api/statisticsGood';
import { useEffect,useState } from 'react';
import Echart from '@/components/echart/index.jsx';
function GoodsStatistics() {
  const [data, setData] = useState({});
  useEffect(() => {
    async function getGoodsStats() {
      const res = await getStatisticsGoodApi();
      if (res.code === 0) {
        setData(res.data);
      }
    }
    getGoodsStats();
  }, []);
  return (
    <>
      <div className={style.goods}>
        <PageHeader title="商品统计" icon="icon-shuju1" />
        <div className={style.goodsContent}>
          <div className={style.echart}>
            <Echart data={data} title="商品统计" />
          </div>
        </div>
      </div>
    </>
  );
}
export default GoodsStatistics;
