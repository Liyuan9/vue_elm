// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
import App from './App'
import './config/rem'
import FastClick from 'fastclick' 

if ('addEventListner' in document) {
    document.addEventListner('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.prototype.axios = axios
axios.defaults.timeout = 5000
axios.defaults.baseURL  = 'http://cangdu.org:8001'
axios.defaults.headers['Content-Type'] = 'application/json'

/* eslint-disable no-new */
new Vue({
  router,
  store,
}).$mount('#app')
