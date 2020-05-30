<template>
  <!--  画布，用来展示地球3D图  vh是浏览器可视界面的高度，vw是宽度 100vh=100%高度 50px是导航的高度-->
  <div id="main" style="height: calc(100vh - 50px);width: calc(100vw - 50px)"/>
</template>

<script>
  // 加载echarts
  import echarts from 'echarts/lib/echarts'

  // 加载数据,data.json在当前路径下
  import jsonData from './data'

  // 必须引入gl组件,用来画飞线图
  import 'echarts-gl'

  // 定义4种路线的颜色,根据不同的类型或级别显示线的不同的颜色

  export default {
    name: 'Index',

    // vue data属性,可以用此属性动态加载数据动态渲染
    data() {
      return {}
    },

    // 当页面加载完毕后自动调用的函数，vue的生命周期函数
    mounted() {
      const myChart = echarts.init(window.document.getElementById('main'))  //初始化 把html的div和echarts绑定 使得有数据就开始渲染

      this.$http.get('/ip/all').then(res => {
        console.log(res)
        // 显示的地图具体的配置
        myChart.setOption({
          // 背景颜色
          backgroundColor: '#000',
          // 地球的详细配置
          globe: {
            // 贴图
            baseTexture: require('../../assets/globe/base-texture.jpg'),
            heightTexture: require('../../assets/globe/height-texture.jpg'),

            shading: 'lambert',

            // 路径是否动态
            postEffect: {
              enable: true
            },

            // 地球内半径
            globeRadius: 80,

            // 地球外半径
            globeOuterRadius: 120,

            // 外界灯光设置
            light: {
              ambient: {
                intensity: 0.4
              },
              main: {
                intensity: 0.4
              }
            },

            viewControl: {

              // 是否自动旋转
              autoRotate: true,
              animationDurationUpdate: 2000,
              targetCoord: ''
            }
          },
          // 外围3D线的具体设置
          series: {

            // 类型
            type: 'lines3D',
            coordinateSystem: 'globe',
            blendMode: 'source-over',

            // 动态飞线的配置，类似于飞机的尾迹,是沿静态线动态变化的,静态线是不动的
            effect: {
              show: true,

              // 周期,也就是速度
              period: 4,

              // 动态线宽度
              trailWidth: 1,

              // 长度,占静态线的百分比
              trailLength: 0.3,

              // 透明度
              trailOpacity: 0.3

              // 设置颜色,在43行已经配置
              // trailColor: 'rgb(29,56,150)'
            },

            // 静态线的配置,静止不动的
            lineStyle: {

              // 静态线宽度
              width: 1.5,

              // 静态线的颜色
              color: 'rgb(29,56,150)',

              // 透明度
              opacity: 0.02
            },

            // 传给echarts的数据
            data: res
          }
        })
        this.$emit('chartSuccess', true)  //$emit 实现子组件向父组件通信
        this.$emit('dataList', res)
      })
    },

    methods: {

      // 转换数据的格式,只用json里面的第3维和第四维
      getAirportCoord(idx) {
        return [jsonData.airports[idx][3], jsonData.airports[idx][4]]
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
