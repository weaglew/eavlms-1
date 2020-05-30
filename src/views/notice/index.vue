<template>
  <!--  消息详情-->
  <div>
    <div style="text-align: center;width: 100%">
      <h1>未读消息</h1>
        <p style="font-weight: bold">共有{{notice.length}}条</p>
    </div>
    <ol style="width: 98%">
      <li v-for="(v,k) in notice"> <!--v 对象 k 索引-->
        <p>发送人用户名：{{v.fromUser.username}}</p>
        <p>发送人邮箱：{{v.fromUser.email}}</p>
        <p>类型：{{v.type | typeFilter}}</p>
        <p>内容：{{v.message}}</p>
        <a style="color: blue;text-decoration:underline" @click="clickHandle(k)">已读</a>
        <hr>
      </li>
    </ol>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        notice: JSON.parse(sessionStorage.getItem('notice')) || []
      }
    },
    filters: {
      typeFilter(value) {
        /**
         * 消息类型分类
         * 0 下发开发
         * 1 下发安全厂商
         * 2 漏洞误报
         * 3 复测误报
         * @type {{}}
         */
        let type = {
          0: '漏洞修复',
          1: '漏洞复测',
          2: '漏洞修复误报',
          3: '漏洞复测误报'
        }
        return type[value]
      }

    },
    methods: {
      clickHandle: function(index) {
        console.log(index)
        let notice = JSON.parse(sessionStorage.getItem('notice'))
        notice.splice(index, 1)  //删除该索引这一条数据
        sessionStorage.setItem('notice', JSON.stringify(notice))
        this.notice = notice
        document.dispatchEvent(new CustomEvent('readMessage', {
          detail: notice.length  //CustomEvent 可带数据的自定义触发事件  返回给navbar的document.addEventListener 赋值给noticeLength
        }))
      }
    }
  }
</script>

<style scoped>

</style>
