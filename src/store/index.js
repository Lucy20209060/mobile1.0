
import babelpolyfill from "babel-polyfill"
import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'
// import * as types from '@/store/types'
import {GETLOGIN} from '@/store/types'

Vue.use(babelpolyfill);
Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        api:Api,				  // api
        selectSiteInfo:{          // 首页选中的地域信息
	        id:'',
	        region:'全国',
	        mobileImg:''
	    },
	    userInfo:{
	    	user_id:'',
	    	is_verify:'',
	    	mobile:''
	    },
        scrollTop:[0,1],
        urlHistory:'',           // url历史记录
        specInfo:{},             // 详情页 规格信息
        classArr:[]              // 分类详情 记录分类级别信息
    },
    mutations: {
    	// 修改选择地域信息
    	reSiteInfo:(state,value) => {
    		state.selectSiteInfo.id = value.id;
    		state.selectSiteInfo.region = value.region;
            state.selectSiteInfo.mobileImg = value.mobileImg;
    	},
    	// 修改用户信息
    	reuserInfo:(state,value) => {
    		state.userInfo.user_id = value.user_id;
    		state.userInfo.is_verify = value.is_verify;
    		state.userInfo.mobile = value.mobile;
    	},
    	[GETLOGIN]:(state) => {
            
    	},
        // 修改滚动条高度
        setScrollTop:(state,value) => {
            state.scrollTop = value;
        },
        // 修改url历史记录
        setUrlHistory:(state,value) => {
            state.urlHistory = value;
        },
        // 修改详情页 规格信息
        setSpecInfo:(state,value) => {
            state.specInfo = value;
        },
        // 修改分类详情 分类级别信息
        setClassArr:(state,value) => {
            state.classArr = value;
        },
    },
    getters: {
        // 获取用户ID
        getUserId:({ userInfo }) => {
            return userInfo.user_id;
        },
        // 获取用户认证状态
        getIsVerify:({ userInfo }) => {
            return userInfo.is_verify;
        },
        // 获取用户电话号码
        getMobile:({ userInfo }) => {
           //var timeout = setTimeout(function(){

                return userInfo.mobile;

         // },500);
        },
    }
})
