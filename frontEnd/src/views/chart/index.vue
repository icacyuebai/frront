<template>
<div>
  <div id='chart' style='width: 80vh;height: 80vh'></div>
</div>
</template>

<script>
import {getEventChart} from '@/api/event'
import * as echarts from 'echarts'

export default {
  name: 'chart',
  data(){
    return{
      data: null,
      myChart: null
    }
  },
  methods:{
      initChart() {
        if(!this.myChart){
          let dom = document.getElementById("chart");
          this.myChart = echarts.init(dom);
        }
        var option;
        option = {
          title: {
            text: '已更新事件统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            top: 'bottom'
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: this.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        option && this.myChart.setOption(option);
      },
  },
  async created(){
    let res = await getEventChart()
    if(res.code === 200){
      this.data = res.result
      this.$nextTick(()=>{
        this.initChart()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>