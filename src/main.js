// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/public/reset.css'
import '@/assets/font/iconfont.css'
import axios from '@/http'
import store from '@/store/index'
import 'babel-polyfill'
import '@/assets/public/rem'
import api from '@/api'

Vue.use(MintUI)
Vue.prototype.$axios = axios
Vue.prototype.$api = api

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})