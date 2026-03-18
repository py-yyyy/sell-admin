import PageHeader from '@/components/pageHeader/pageHeader';
import style from './order.module.scss';
import { getStatisticsOrderApi } from '@/api/statisticsOrder';
import { useEffect,useState } from 'react';
import Echart from '@/components/echart/index.jsx';
function OrderStatistics() {
  const [data, setData] = useState({});
  useEffect(() => {
    async function getOrderStats() {
      const res = await getStatisticsOrderApi();
      if(res.code === 0){
        setData(res.data);
      }
    }
    getOrderStats();
  }, []);
  return (
    <>
      <div className={style.order}>
        <PageHeader title="订单统计" icon="icon-shuju1" />
        <div className={style.orderContent}>
          <div className={style.echart}>
            <Echart data={data} title="订单统计" />
          </div>
        </div>
      </div>
    </>
  );
}
export default OrderStatistics;