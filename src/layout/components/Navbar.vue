<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>
    <!--右侧人物开始-->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
               class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              今日态势
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--系统通知开始 组件badge让消息数和图标对齐-->
    <div class="right-menu">
      <badge @click="toNoticePage" :value="noticeLength" width="25px" height="13px">
        <el-button icon="el-icon-bell" circle size="mini"/>
      </badge>
    </div>
    <div class="right-menu">
      <badge @click="toNoticePage" :value="noticeLength" width="25px" height="13px">
        <el-button icon="el-icon-message" circle size="mini"/>
      </badge>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import Badge from '@/components/Badge'
  import WebSocket from '../../utils/websocket'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      Badge
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    data() {
      return {
        //消息数量
        noticeLength: 0
      }
    },
    created() {
      WebSocket.init(this.onMessage)
      //加载提示音
      this.audio = new Audio(require('../../assets/audio/msg.mp3'))
      this.audio.volume = 1 //音量，取值范围 0.1 到 1.0
      let notice = JSON.parse(sessionStorage.getItem('notice'))
      this.noticeLength = notice && notice.length || 0
      //消息注册监听 对document对象新增一个监听
      document.addEventListener('readMessage', (e) => {  //e是notice的自定义监听封装成的detail对象 里面暂时只有detail一个数据 可扩展
        this.noticeLength = e.detail
      })
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      logout() {
        //退出前清除用户信息
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('routes')
        this.$router.replace(`/login`)
      },
      //点击消息提示图标进入消息列表
      toNoticePage() {
        this.$router.push('/notice')
      },
      //前端socket.onmessage 接收后端数据 然后回调onmessage函数展示
      onMessage(data) {
        this.$notify.warning({
          title: '您有新的消息',
          offset: 40,
          dangerouslyUseHTMLString: true,
          message: data.message
        })
        //播放提示音
        this.audio.play()
        let oldNotice = sessionStorage.getItem('notice')  //用户还未读的消息取出赋给oldNotice
        //当oldNotice不为空并且解析oldNotice为对象也不为空（true），返回JSON.parse(oldNotice)的值，当前面两个判断有一个为空值返回[]数组
        oldNotice = oldNotice && JSON.parse(oldNotice) || []
        oldNotice.push(data)  //将新的消息添加进旧消息里
        sessionStorage.setItem('notice', JSON.stringify(oldNotice))  //更新sessionstore里的notice
        this.noticeLength = oldNotice.length
      }
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    margin-right: 40px;
  }

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
