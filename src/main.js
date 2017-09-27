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

Vue.use(VueLazyLoad, {
    loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})