<!--让消息数和图标对齐的自写组件-->
<template>
  <div class="badge-content" @click="badgeClickHandle">
    <slot />
    <transition>
      <sup
        class="badge-note"
        :style="{width: width,height: height,lineHeight: height}"
        v-text="value"
      />
    </transition>
  </div>
</template>
<!--props中的value width height 接收父组件传值（谁调用该vue谁就是父组件）-->
<script>
  export default {
    name: 'Badge',
    props: {
      value: Number,
      width: {
        type: String,
        default: '25px'
      },
      height: {
        type: String,
        default: '13px'
      }
    },
    methods:{
      badgeClickHandle(){
        this.$emit('click')
      }
    }
  }
</script>

<style scoped lang="scss">
  .badge-content {

    .badge-note {
      z-index: 10;
      display: inline-block;

      font-size: 14px;
      height: 20px;
      color: white;  //字体颜色
      text-align: center;
      background-color: #F56C6C;  //背景颜色
      border-radius: 8px;   //圆角大小
      position: relative;
      top: -14px;
      left: -14px;
    }
  }
</style>

