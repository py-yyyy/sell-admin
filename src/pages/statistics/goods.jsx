import PageHeader from '@/components/pageHeader/pageHeader';
import style from './goods.module.scss';
import { getStatisticsGoodApi } from '@/api/statisticsGood';
import { useEffect,useRef } from 'react';
import * as echarts from 'echarts';
function GoodsStatistics() {
  const echartRef = useRef(null);
  useEffect(() => {
    async function getGoodsStats() {
      const res = await getStatisticsGoodApi();
      if (res.code === 0) {
        var myChart = echarts.init(echartRef.current);
        const series = res.data.source.map(item => {
          return {
            name: item.type,
            type: 'line',
            data: item.data
          }
        })
        myChart.setOption({
          legend: {
            // Try 'horizontal',
            orient: 'horizontal',
            right: 'center',
            bottom: 10,
          },
          title: {
            text: '订单统计'
          },
          tooltip: {},
          xAxis: {
            data: [...res.data.date]
          },
          yAxis: {},
          color: ['#69b1ff', '#ff4d4f', '#95de64', '#fa8c16', '#722ed1', '#13c2c2'],
          series: series,
        });
      }
    }
    getGoodsStats();
  }, [echartRef]);
  return (
    <>
      <div className={style.goods}>
        <PageHeader title="商品统计" icon="icon-shuju1" />
        <div className={style.goodsContent}>
          <div className={style.echart} ref={echartRef}></div>
        </div>
      </div>
    </>
  );
}
export default GoodsStatistics;
