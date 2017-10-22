import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// vuex的logger插件
import createLogger from 'vuex/dist/logger'

// 全局引入Vuex
Vue.use(Vuex)

// 如果是开发环境下才开启debug
// npm run dev 开启的服务NODE_ENV为 dev
// npm run build 开启的 NODE_ENV为 production
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,  // 开启严格模式
    plugins: debug ? [createLogger()] : []
})