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
            data: [...res.data.date]
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
            <div className={styles.dataItemImg}>
              <i className="iconfont icon-dingdan1" style={{ fontSize: '50px', color: '#69b1ff' }}></i>
              <div className={styles.dataItemText}>
                <p>总订单</p>
                <span>￥25,072</span>
              </div>
            </div>
            <div className={styles.dataItemLine}></div>
          </div>
          <div className={styles.dataItemContent}>
            <div className={styles.dataItemImg}>
              <i className="iconfont icon-xiaoshoue" style={{ color: 'red', fontSize: '50px' }}></i>
              <div className={styles.dataItemText}>
                <p>总销售额</p>
                <span>￥34,072</span>
              </div>
            </div>
            <div className={styles.dataItemLine}></div>
          </div>
          <div className={styles.dataItemContent}>
            <div className={styles.dataItemImg}>
              <i className="iconfont icon-dingdan3" style={{ fontSize: '50px', color: '#95de64' }}></i>
              <div className={styles.dataItemText}>
                <p>今日订单</p>
                <span>￥54,072</span>
              </div>
            </div>
            <div className={styles.dataItemLine}></div>
          </div>
          <div className={styles.dataItemContent}>
            <div className={styles.dataItemImg}>
              <i className="iconfont icon-xiaoshoue1" style={{ color: "orange", fontSize: '50px' }}></i>
              <div className={styles.dataItemText}>
                <p>今日销售额</p>
                <span>￥98,110</span>
              </div>
            </div>
            <div className={styles.dataItemLine}></div>
          </div>
        </div>
        <div className={styles.echart} ref={echartRef}></div>
      </div>
    </>
  );
}
export default Home;