import * as echarts from 'echarts'

export default {
  // echarts 作为全局变量使用
  install: app => {
    app.config.globalProperties.$echarts = (element,option) => {
      // 设置在哪个元素上渲染图表
      let myChart = echarts.init(document.getElementById(element))
      
      // 渲染图表
      myChart.setOption(option)
     }
   }
}
