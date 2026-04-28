import type { RouteRecordRaw } from 'vue-router'

export const constantRoute: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ],
  },
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/index.vue'),
    meta: { title: '数据大屏', icon: 'DataBoard' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: { title: '404' },
  },
]

export const anyRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'any',
  redirect: '/404',
}

export const asyncRoute: RouteRecordRaw[] = [
  {
    path: '/acl',
    name: 'Acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user',
    meta: { title: '权限管理', icon: 'Lock' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: { title: '角色管理', icon: 'Avatar' },
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu' },
      },
    ],
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/spu',
    meta: { title: '商品管理', icon: 'Goods' },
    children: [
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: { title: 'SPU管理', icon: 'Box' },
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: { title: 'SKU管理', icon: 'Collection' },
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: { title: '属性管理', icon: 'List' },
      },
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: { title: '品牌管理', icon: 'List' },
      },
    ],
  },
]
