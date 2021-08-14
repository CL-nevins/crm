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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 尝试自己重新挂个界面上来
  {
    path: '/admin',
    component: Layout,
    // redirect: noRedirect,
    redirect: '/adminManage',
    children: [{
      path: 'adminManage',
      name: 'adminManage',
      component: () => import('@/views/admin/adminManage'),
      meta: { title: '管理员管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/customerList',
    name: 'customer',
    meta: { title: '客户管理', icon: 'dashboard' },
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        component: () => import('@/views/customer/customerList'),
        meta: { title: '客户列表' }
      },
      {
        path: 'customerAdd',
        name: 'customerAdd',
        component: () => import('@/views/customer/customerAdd'),
        meta: { title: '添加客户' }
      },
      {
        path: 'addConsult/:guid',
        name: 'addConsult',
        component: () => import('@/views/customer/addConsult'),
        meta: { title: '新增咨询' }
      },
      {
        path: 'customerDetail/:guid',
        name: 'customerDetail',
        component: () => import('@/views/customer/customerDetail'),
        meta: { title: '客户详情' }
      },
      {
        path: 'customerLink',
        name: 'customerLink',
        component: () => import('@/views/customer/addConsult'),
        meta: { title: '客户联系人' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
