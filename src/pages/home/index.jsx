import * as echarts from 'echarts';
import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.module.scss';
import { getHomeDataApi } from '@/api/home';
function Home() {
  const echartRef = useRef(null);
  useEffect(() => {
    async function getHomeData() {
      const res = await getHomeDataApi();
      if (res.code === 0) {
        console.log(res.data);
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
            text: '数据统计'
          },
          tooltip: {},
          xAxis: {
            data: res.data
          },
          yAxis: {},
          series: series
        });
      }
    }
    getHomeData();
  }, [echartRef])

  return (
    <>
      <div className={styles.dataBox}>
        <div className={styles.dataItem}>
          <div className={styles.dataItemContent}>
            <i className="iconfont icon-dingdan1" style={{ fontSize: '80px', color: '#69b1ff' }}></i>
            <p>总订单</p>
            <span>￥25,072</span>
          </div>
          <div className={styles.dataItemContent}>
            <i className="iconfont icon-xiaoshoue" style={{ color: 'red', fontSize: '80px' }}></i>
            <p>总销售额</p>
            <span>￥34,072</span>
          </div>
          <div className={styles.dataItemContent}>
            <i className="iconfont icon-dingdan3" style={{ fontSize: '80px', color: '#95de64' }}></i>
            <p>今日订单</p>
            <span>￥54,072</span>
          </div>
          <div className={styles.dataItemContent}>
            <i className="iconfont icon-xiaoshoue1" style={{ color: "orange", fontSize: '80px' }}></i>
            <p>今日销售额</p>
            <span>￥98,110</span>
          </div>
        </div>
        <div className={styles.echart} ref={echartRef}></div>
      </div>
    </>
  );
}
export default Home;