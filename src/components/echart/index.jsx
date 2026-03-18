import { useEffect, useRef } from "react";
import * as echarts from "echarts";
function Echart({data,title}) {
  const echartRef = useRef(null);
  const myChartRef = useRef(null);
  useEffect(() => {
    if (!data.source || !data.date) {
      return;
    }

    myChartRef.current = echarts.init(echartRef.current);
    var myChart = myChartRef.current;

    const series = data.source.map((item) => {
      return {
        name: item.type,
        type: "line",
        data: item.data,
      };
    });

    myChart.setOption({
      legend: {
        // Try 'horizontal',
        orient: "horizontal",
        right: "center",
        bottom: 10,
      },
      title: {
        text: title,
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        data: [...data.date],
      },
      yAxis: {},
      color: ["#69b1ff", "#ff4d4f", "#95de64", "#fa8c16", "#722ed1", "#13c2c2"],
      series: series,
    });

    window.addEventListener("resize", changeSize);
    return () => {
      window.removeEventListener("resize", changeSize);
    };
  }, [data]);

  const changeSize = () => {
    myChartRef.current.resize();
  };
  return <div ref={echartRef} style={{ height: "100%" ,width: "100%" }} />;
}

export default Echart;
