// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import router from './router'
import VueProgressBar from 'vue-progressbar'
import 'normalize.css'
import './stylus/index'

Vue.config.productionTip = false

Vue.use(VueProgressBar, {
  color: '#1890ff',  // 进度条颜色
  height: '2px'  // 进度条高度
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
