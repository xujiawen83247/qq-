// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'
import '@/assets/css/app.css'
import 'font-awesome/css/font-awesome.css'
import '@/iconfont/iconfont.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueLazyload, {
        preLoad: 1.3,
        error: 'dist/error.png',
        loading: require('@/assets/loading.gif'), //loading: require('@/assets/loading.gif')加载自己的等待图片
        attempt: 1
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})