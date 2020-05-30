<template>
  <div v-loading="loading">
    <div style="height: calc(100vh - 50px );width: calc(100vw - 50px )">
      <!--本子组件 src/views/globe/index.vue实现3D地球效果 上方div控制3d地球图大小-->
      <index @chartSuccess="e=>{loading=false}" @dataList="function(e) {
        dataList=e
      }"/>
    </div>
    <div style="" class="globe-note">
      今日访问总次数：{{this.dataList.length}}
    </div>
  </div>
</template>

<script>

  import index from '../globe/index'

  export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { index },
    data: function() {
      return {
        loading: true,
        dataList: []

      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .globe-note {
    padding-top: 170px;
    display: block;
    z-index: 100;
    position: absolute;
    top: 15%;
    left: 3%;
    border-width: 2px;
    /*border-color: #369640;*/
    border-style: none;
    background-color: black;
    width: 250px;
    height: 380px;
    color: white;
    font-size: 18px;
    text-align: center;
    overflow: hidden;

    ul li {
      font-size: 17px;
      text-align: left;
      line-height: 24px;
    }
  }

  .el-main {
    height: 300px;
  }

  .dashboard {
    &-container {
      margin: 3px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }

    .text {
      font-size: 14px;
    }

    .item {
      padding: 18px 0;
    }

    .box-card {
      width: 480px;
    }

  }

</style>

