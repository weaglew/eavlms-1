//前端路由鉴权
import router, { asyncRoutes, constantRoutes } from './router'
// import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
//路由之前的事件
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  //鉴权
  if (to.path === '/login') {
    next()
  } else {
    let user = sessionStorage.getItem('user')
    if (user) {
    //   //保存验证通过的路由
    //   let roles = [user.type]
    //   //符合权限的路由
    //   let accessedRoutes
    //   if (roles.includes('0')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   console.log('accessedRoutes',accessedRoutes)
    //   console.log('router',router)
      // router.addRoutes(accessedRoutes)
      next()
    } else {
      Message.error('尚未登陆！')
      next({ path: '/login' })
    }
  }
  NProgress.done()
})

// set page title
////document.title = getPageTitle(to.meta.title)

// determine whether the user has logged in
// const hasToken = getToken()
//
// if (hasToken) {
//   if (to.path === '/login') {
//     // if is logged in, redirect to the home page
//     next({ path: '/' })
//     NProgress.done()
//   } else {
//     const hasGetUserInfo = store.getters.name
//     if (hasGetUserInfo) {
//       next()
//     } else {
//       try {
//         // get user info
//         await store.dispatch('user/getInfo')
//
//         next()
//       } catch (error) {
//         // remove token and go to login page to re-login
//         await store.dispatch('user/resetToken')
//         Message.error(error || 'Has Error')
//         next(`/login?redirect=${to.path}`)
//         NProgress.done()
//       }
//     }
//   }
// } else {
//   /* has no token*/
//
//   if (whiteList.indexOf(to.path) !== -1) {
//     // in the free login whitelist, go directly
//     next()
//   } else {
//     // other pages that do not have permission to access are redirected to the login page.
//     next(`/login?redirect=${to.path}`)

//路由之后的事件
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

//判断role字段的权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

//添加路由
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
