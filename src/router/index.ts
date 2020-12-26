import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
Vue.use(VueRouter)
// 路由配置规则
const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
    },
    {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue')
    },
    {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue')
    },
    {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
    },
    {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
    },
    {
        path: '/advertSpace',
        name: 'advertSpace',
        component: () => import(/* webpackChunkName: 'advertSpace' */ '@/views/advert-space/index.vue')
    },
    {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
