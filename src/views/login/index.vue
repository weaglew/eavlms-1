<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">企业资产漏洞周期管理平台</h3>
      </div>

      <el-form-item prop="number">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="number"
          v-model="loginForm.number"
          placeholder="Number"
          name="number"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>  <!--===严格相等-->
        </span>
      </el-form-item>
      <!--以下是滑动验证码的实现方式-->
      <el-form-item prop="verify" style="border-radius: 0">

        <slide-verify :l="42"
                      :r="10"
                      :w="445"
                      :h="185"
                      :imgs="imgs" @success="verifyHandleSuccess" @fail="verifyHandlefail"
                      slider-text="拖动滑块填充验证"></slide-verify>
      </el-form-item>
      <!--滑动验证码代码结束-->
      <!--登陆提交按钮-->
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">Login
      </el-button>
    </el-form>
  </div>
</template>

<script>
  //引入验证码组件
  import SlideVerify from '@/components/slide-verify'
  import { constantRoutes } from '@/router'
  import { filterAsyncRoutes } from '../../permission'

  export default {
    name: 'Login',
    components: {
      SlideVerify
    },
    computed: {
      //滑动验证码背景图来源
      imgs() {
        let imgs = []
        for (let i = 1; i < 13; i++) {
          imgs.push(require(`../../assets/slide-verify/bg-img/${i}.jpg`))
        }
        return imgs
      }
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('Please enter the user number'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('Please enter the password'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          number: '',
          password: ''
        },
        loginRules: {
          number: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        loading: false,
        passwordType: 'password',
        verifySuccess: false
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      //点击login后的处理逻辑，即进行用户名和密码验证
      handleLogin() {
        if (!this.verifySuccess) {
          this.$message.error('请拖动滑块以验证')
          return
        }
        /*ref:被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。
        如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；
        如果用在子组件上，引用就指向组件*/
        /*vm.$refs:一个对象，持有注册过 ref attribute 的所有 DOM 元素和组件实例。*/
        this.$refs.loginForm.validate(valid => {    // this.$refs.loginForm用于访问 <el-form/>实例
          if (valid) {
            //请求后端
            this.$http.post('/user/login', {
              //请求参数
              number: this.loginForm.number,
              password: this.loginForm.password
            }).then(user => {
              //登录成功
              if (user && user.id) {
                this.$message.success('登录成功！')
                //先存储用户信息
                sessionStorage.setItem('user', JSON.stringify(user))  //存放用户信息，随时读取

                //根据用户角色过滤符合角色权限的路由放到sessionstore中  constantRoutes是router\index.js的
                let roles = [user.type]
                //accessedRoutes存储符合权限的路由
                let accessedRoutes=[]
                if (roles.includes('0')) {
                  accessedRoutes = constantRoutes || []
                } else {
                  accessedRoutes = filterAsyncRoutes(constantRoutes, roles)
                }
                sessionStorage.setItem('routes', JSON.stringify(accessedRoutes))
                //跳转路由
                this.$router.push({ path: '/dashboard' })
                //登录失败
              } else {
                this.$message.error('登录失败，请检查用户名或密码！')
              }
            }).catch(v => {
              this.$message.error('登录失败，请检查用户名或密码！')
            })
          }
        })
      },
      //拖动验证码验证成功
      verifyHandleSuccess() {
        this.verifySuccess = true
        console.log('verifySuccess')
      },
      //拖动验证码验证失败
      verifyHandlefail() {
        this.verifySuccess = false
      }

    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
