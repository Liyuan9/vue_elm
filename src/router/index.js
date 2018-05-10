import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

const home = () => import('@/page/home/home.vue')
const city = () => import('@/page/city/city.vue')
const msite = () => import('@/page/msite/msite.vue')
const shop = () => import('@/page/shop/shop.vue')

Vue.use(Router)


const routers = [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '',
                redirect: '/home'
            },
            // 首页
            {
                path: '/home',
                component: home
            },
            // 当前选择城市页
            {
                path: '/city/:cityid',
                component: city
            },
            // 地区周围商家列表
            {
                path: '/msite',
                meta: {
                    keepAlive: true
                },
                component: msite
            },
            // 进入商家店铺
            {
                path: '/shop',
                component: shop
            }

        ]
    }
]


export default new Router({
    mode: 'history',
    routes: routers,
    scrollBehavior (to, from, savedPosition) {
        if(savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return { x: 0, y: to.meta.savedPosition || 0}
        }
    }
})
