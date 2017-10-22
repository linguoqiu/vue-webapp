import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'

// 使用Router组件
Vue.use(Router)

// 配置路由
export default new Router({
    routes: [{
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/singer',
            component: Singer,
            children: [{
                path: ':id',
                component: SingerDetail
            }]
        }
    ]
})
