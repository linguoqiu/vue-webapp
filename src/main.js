import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.scss'

Vue.config.productionTip = false

// fastclick添加到body上，这样可以消除 所有的非按钮的点击事件的300ms的延迟
fastclick.attach(document.body)

// 配置图片懒加载
Vue.use(VueLazyLoad, {
    // common/image/default.png 这是小鸡的图片
    // 以下为配置没请求到图片的时候，默认展示的图片
    loading: require('components/m-header/logo@2x.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})