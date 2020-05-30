import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
//静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { roles: [0, 1, 2] }
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: { roles: [0, 1, 2] }
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { roles: [0, 1, 2] },
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '今日感知', icon: 'dashboard', roles: [0, 1, 2] }
    },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/notice/index'),
        meta: { title: '消息', icon: 'dashboard', roles: [0, 1, 2] },
        hidden: true
      }

    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '基本漏洞信息库', icon: 'example', roles: [0, 1, 2] },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'CVE', icon: 'table', roles: [0, 1, 2] }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '  资产漏洞', icon: 'tree', roles: [0, 1, 2] }
      }
    ]

  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '新增漏洞上报', icon: 'form', roles: [0, 2] }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '已有漏洞生命周期管理',
      icon: 'nested',
      roles: [0, 1, 2]
    }, // 子菜单
    children: [
      {
        path: 'enterpriseManager',
        component: () => import('@/views/nested/enterpriseManager/index'), // Parent router-view
        name: 'enterpriseManager',
        meta: { title: '企业安全管理人员', roles: [0] },
        children: [
          {
            path: 'toCoder',
            component: () => import('@/views/nested/enterpriseManager/toCoder/index'),
            name: 'toCoder',
            meta: { title: '需下发漏洞' }
          },
          {
            path: 'toSecurityPerson',
            component: () => import('@/views/nested/enterpriseManager/toSecurityPerson/index'),
            name: 'ToSecurityPerson',
            meta: { title: '需复测漏洞' }
          },
          {
            path: 'done',
            component: () => import('@/views/nested/enterpriseManager/done/index'),
            name: 'Done',
            meta: { title: '已修复漏洞' }
          },
          {
            path: 'assets',
            name: 'Assets',
            component: () => import('@/views/assets/index'),
            meta: { title: '资产管理', icon: 'dashboard', roles: [0] }
          },
          {
            path: 'user',
            name: 'User',
            meta: { title: '用户管理', icon: 'dashboard', roles: [0] },
            component: () => import('@/views/user/index'),
          }
        ]
      },
      {
        path: 'coder',
        component: () => import('@/views/nested/coder/index'), // Parent router-view
        name: 'coder',
        meta: { title: '系统软件开发人员', roles: [0, 1] },
        children: [
          {
            path: 'vulnsFix',
            component: () => import('@/views/nested/coder/vulnsFix/index'),
            name: 'ToFix',
            meta: { title: '需修复漏洞' }
          },
          {
            path: 'retestResult',
            component: () => import('@/views/nested/coder/retestResult/index'),
            name: 'RetestResult',
            meta: { title: '漏洞复测结果' }
          }
        ]
      },
      {
        path: 'securityPerson',
        component: () => import('@/views/nested/securityPerson/index'),
        meta: { title: '信息安全技术厂商人员', roles: [0, 2] },
        children: [
          {
            path: 'retest',
            component: () => import('@/views/nested/securityPerson/retest/index'),
            name: 'Retest',
            meta: { title: '需复测漏洞' }
          },
          {
            path: 'retestResult',
            component: () => import('@/views/nested/securityPerson/retestResult/index'),
            name: 'RetestResult',
            meta: { title: '漏洞复测结果' }
          }
        ]
      }
    ]
  },

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
