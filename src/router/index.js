import Vue from 'vue'
import Router from 'vue-router'
import index from '@/page/index'				       // 首页
import login from '@/page/login'				       // 登录
import register from '@/page/register'			       // 注册
import detail from '@/page/detail'				       // 详情页		
import nopage from '@/page/404'
import shopCart from '@/page/shopCar'			// 购物车
import classify from '@/page/classify'			// 分类页
import classifyDetail from '@/page/classifyDetails'
import mine from '@/page/mine'					// 我的
import search from '@/page/search'				// 搜索
import help from '@/page/help'                  // 帮助

import home from '@/page/home'   //首页
import helpDetail from '@/page/helpDetail'

Vue.use(Router)

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/',
        name:'index',
        component:index,
        children:[
            {path: '/home',name: 'home',component: home},
            {path: '/classify',name: 'classify',component: classify},
            {path: '/shopCart',name: 'shopCart',component: shopCart},
            {path: '/mine',name: 'mine',component: mine}
        ],
        meta:{
            requireAuth:true
        }
    },

    {
        path: '/login',
        name: 'login',
        component: login
    },

    {
        path: '/register/:id',
        name: 'register',
        component: register
    },

    {
        path: '/detail/:id',
        name: 'detail',
        component: detail,
        meta:{
            requireAuth:true
        }
    },

    {
        path: '/search',
        name: 'search',
        component: search,
        meta:{
            requireAuth:true
        }
    },

    {
        path: '/help',
        name: 'help',
        component: help,
        meta:{
            requireAuth:true
        }
    },

    {
        path: '/classifyDetail/:id',
        name: 'classifyDetail',
        component: classifyDetail,
        meta:{
            requireAuth:true
        }
    },

    {
        path: '/helpDetail/:id/:title',
        name: 'helpDetail',
        component: helpDetail,
        meta:{
            requireAuth:true
        }
    },

    {
        path: '*',
        name: 'nopage',
        component: nopage
    },
]

const router = new Router({
    // mode:'history',
    // hashbang:false,
    routes
});

import axios from 'axios'
import api from '@/api'
import store from '@/store/index'
import { Toast } from 'mint-ui'

axios({
    url:api.login.is_login
}).then(function(res) {

    if(res.data.code == 2){

        let Info = {
            user_id:res.data.user_id,
            is_verify:res.data.is_verify,
            mobile:res.data.mobile
        }
        store.commit('reuserInfo',Info);

    }else{

        let Info = {
            user_id:'',
            is_verify:'',
            mobile:''
        }        
        store.commit('reuserInfo',Info);
    }

}).catch(function (error) {
    // _this.$toast(error.msg);   
});

router.beforeEach((to, from, next) => {

    // console.log(from.path)
    store.commit('setUrlHistory',from.path);

    next();
})


export default router;