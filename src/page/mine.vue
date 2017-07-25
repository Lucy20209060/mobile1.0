<template>
  <div class="minetwo">
    <div class="myinfo">
      <img src="/static/images/minebg.png" class="minebg">        
      <div class="loginfo">       
        <span class="companyname">安厨供应链</span>
        <div class="mypic">
          <img src="/static/images/mine.png" alt="">
        </div>
        <span class="name" v-if="mobile">{{ mobile }}</span>
        <div class="logout">
          <span class="logoutbtn" v-if="mobile" @click="logout">
            <i class="iconfont icon-denglu"></i><span class="log">退出登录</span>
          </span>
          <span class="logoutbtn" v-if="!mobile">
            <router-link to="/login"><span class="login">立即登录</span></router-link>        
          </span>
        </div>
      </div>
    </div>
    <div class="myfunction">
      <h4>我的功能</h4>
      <div class="functionlist">
        <router-link tag="dl" :to="{path:'/register/3'}">
          <dt><img src="/static/images/dingdan.png" alt=""></dt>
          <dd>查看订单</dd>
        </router-link>

        <dl v-on:click="service">
          <dt><img src="/static/images/lianxiwomen .png" alt=""></dt>
          <dd>联系我们</dd>
        </dl>

        <router-link tag="dl" :to="{path:'/help'}">
          <dt><img src="/static/images/bangzhu.png" alt=""></dt>
          <dd>帮助</dd>
        </router-link>
      </div>
    </div>
  </div>
</template>
 
<script>
import { bodyHeight } from '@/assets/public/function'

export default {
  name: 'mine',
  data (){
    return {
      mobile: '',
      clientHeight:document.documentElement.clientHeight
    }
  },
  created(){

    const _this = this;

    _this.mobile = _this.$store.state.userInfo.mobile;

    let timeoutTem = setTimeout(function(){
      _this.mobile = _this.$store.state.userInfo.mobile;
      clearTimeout(timeoutTem)
    },500);

  },
  methods:{
    service(){
      ysf.open();
    },
    logout() {
      var _this = this;
      this.$axios({
        url: this.$api.mine.logout,
      }).then(function(res){
        if (res.data.code == 1){

          _this.$toast({
            message: res.data.msg,
            position: 'center',
            duration: 1000
          });

        // 删除用户信息
        let Info = {
            user_id:'',
            is_verify:'',
            mobile:''
        }

        _this.$store.commit('reuserInfo',Info)

        _this.mobile = '';

        }else{        

        }
      }).catch(function(error){

      })
    }
    
  }
}
</script>

 <style lang="scss" scoped>
  .minetwo {
    height: 12rem;
  }
  .myinfo {
    width: 100%;
    height: 7.5rem;
    background: #009e4d;
    position: relative;
  }
  .myinfo .loginfo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .logout {
    z-index: 12;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    display: inline-block;
    text-align: center;
    color: #fff;
  }
  .logoutbtn {
    height: .6rem;
    width: 2rem;
    background: rgba(255,255,255,0.3);
    padding: 0 .2rem;
    line-height: .56rem;
    display: inline-block;
    font-size: .26rem;
    border-radius: 1rem;
    i {
      margin-right: .15rem;
      font-size: .26rem;
    }
    .log {
      height: .6rem;
      line-height: .65rem;
    }
    .login {
      height: .6rem;
      line-height: .65rem;
      color: #fff;
    }
    
  }
  .myinfo .minebg {
    width: 100%;
    height: 100%;
  }
  .minetwo .mypic {
    z-index: 12;
    height: 1.8rem;
    width: 100%;
    text-align: center;
    padding-top: 1rem;      
    img {
      width: 1.7rem;
      height: 1.7rem;
      display: inline-block;
      border-radius: 50%;
    }
  }
  .minetwo .name {
    z-index: 12;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    display: inline-block;
    text-align: center;
    color: #fff;
  }
  .minetwo .companyname {
    z-index: 12;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    display: inline-block;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
  }
  .myfunction {
    background: #fff;
    margin-top: .2rem;
    h4 {
      height: .8rem;
      font-weight: 400;
      line-height: .8rem;
      font-size: .3rem;
      padding-left: .3rem;
      border-bottom: 1px solid #eee; 
    }
  }
  .functionlist {
    width: 100%;
    height: 2rem;
    display: flex;
    background: #fff;
    dl {
      flex: 1;
      border-right: 1px solid #eee;
      dt {
        height: .6rem;
        width: 100%;
        line-height: .6rem;
        text-align: center;
        padding: .3rem 0;
        img {
          width: .6rem;
          height: .6rem;
          display: inline-block;
        }
      }
      dd {
        font-style: none;
        font-size: .3rem;
        text-align: center;
      }
    }
  }
 </style>




