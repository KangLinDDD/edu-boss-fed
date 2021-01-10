import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'
Vue.use(VueRouter)
// 路由配置规则
const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
    },
    {
        path: '*',
        name: '404',
        component: () =>
            import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
    },
    {
        path: '/',
        component: Layout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/home', // 默认子路由
                name: 'home',
                component: () =>
                    import(
                        /* webpackChunkName: 'home' */ '@/views/home/index.vue'
                    )
            },
            {
                path: '/menu',
                name: 'menu',
                component: () =>
                    import(
                        /* webpackChunkName: 'menu' */ '@/views/menu/index.vue'
                    )
            },
            {
                path: '/resource',
                name: 'resource',
                component: () =>
                    import(
                        /* webpackChunkName: 'resource' */ '@/views/resource/index.vue'
                    )
            },
            {
                path: '/role',
                name: 'role',
                component: () =>
                    import(
                        /* webpackChunkName: 'role' */ '@/views/role/index.vue'
                    )
            },
            {
                path: '/role/:roleId/alloc-menu',
                name: 'alloc-menu',
                component: () =>
                    import(
                        /* webpackChunkName: 'alloc-menu' */ '@/views/role/components/alloc-menu.vue'
                    ),
                props: true // 将路由路径参数映射到组件的props中
            },
            {
                path: '/role/:roleId/alloc-resource',
                name: 'alloc-resource',
                component: () =>
                    import(
                        /* webpackChunkName: 'alloc-resource' */ '@/views/role/components/alloc-resource.vue'
                    ),
                props: true // 将路由路径参数映射到组件的props中
            },
            {
                path: '/user',
                name: 'user',
                component: () =>
                    import(
                        /* webpackChunkName: 'user' */ '@/views/user/index.vue'
                    )
            },
            {
                path: '/course',
                name: 'course',
                component: () =>
                    import(
                        /* webpackChunkName: 'course' */ '@/views/course/index.vue'
                    )
            },
            {
                path: '/advert-space',
                name: 'advertSpace',
                component: () =>
                    import(
                        /* webpackChunkName: 'advertSpace' */ '@/views/advert-space/index.vue'
                    )
            },
            {
                path: '/advert',
                name: 'advert',
                component: () =>
                    import(
                        /* webpackChunkName: 'advert' */ '@/views/advert/index.vue'
                    )
            },
            {
                path: '/menu/create',
                name: 'menu-create',
                component: () =>
                    import(
                        /* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'
                    )
            },
            {
                path: '/menu/:id/edit',
                name: 'menu-edit',
                component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue')
            }
        ]
    }
]
const router = new VueRouter({
    routes
})
// 全局前置守卫：任何页面的访问都要经过这里
// to: 要去哪里的信息
// from: 从哪里来的路由信息
// next：通行的标志
router.beforeEach((to, from, next) => {
    // to.matched 是匹配到的路由记录
    const matchRoutes: boolean = to.matched.some(record => record.meta.requiresAuth)
    // 如果记录中没有需要登录信息的
    if (!matchRoutes) {
        next()
        return
    }
    const user = store.state.user
    // 需要登陆信息则判断有没有登录信息
    if (!user) {
        next({
            name: 'login',
            query: {
                redirect: to.fullPath // 把登陆成功需要返回的页面告诉登陆页面
            }
        })
    } else {
        next()
    }
})
export default router