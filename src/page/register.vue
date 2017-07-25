<template>
  <div class="register">
    <header>
      <pageHead>
        <i slot="head-left" class="iconfont icon-fanhui" @click="goBack"></i>
        <span slot="head-center" v-if="sign == 1">注册引导</span>
        <span slot="head-center" v-if="sign == 2">认证引导</span>
        <span slot="head-center" v-if="sign == 3">查看订单</span>
      </pageHead>
    </header>
    
    <div class="register-alert">
      <dl v-if="sign == 1">
        <dt><img src="/static/images/reg.png"></dt>
        <dd class="register-alert1">1.打开电脑浏览器输入安厨供应链网址：</dd>
        <dd class="register-alert2"><span>https://b2b.hzanchu.com</span></dd>
        <dd class="register-alert3">2.点击"<i style='color:#009e4d;'>登录/注册</i>"按钮，进行注册</dd>
        <!-- <dd class="register-alert3">3.进入"<i style='color:#009e4d;'>个人中心</i>"查看订单及其内容</dd> -->
      </dl>  

      <dl v-if="sign == 2">
        <dt><img class="proof-img" src="/static/images/proof.png"></dt>
        <dd class="register-alert1">1.打开电脑浏览器输入安厨供应链网址：</dd>
        <dd class="register-alert2"><span>https://b2b.hzanchu.com</span></dd>
        <dd class="register-alert3">2.进行登录并完成信息认证</dd>
      </dl> 
      <dl v-if="sign == 3">
        <dt><img class="proof-img" src="/static/images/proof.png"></dt>
        <dd class="register-alert1">1.打开电脑浏览器输入安厨供应链网址：</dd>
        <dd class="register-alert2"><span>https://b2b.hzanchu.com</span></dd>
        <dd class="register-alert3">2.点击"<i style='color:#009e4d;'>登录/注册</i>"按钮，进行登录</dd>
        <dd class="register-alert3">3.进入"<i style='color:#009e4d;'>个人中心</i>"查看订单及其内容</dd>
      </dl> 
    </div>
    
  </div>
</template>

<script>
import pageHead from '@/components/head'
import { bodyHeight } from '@/assets/public/function'
// 1 注册引导页 2 认证引导页
export default {
  name: 'register',
  data (){
    return {
      sign:this.$route.params.id
    }
  },
  components: {
    pageHead
  },
  mounted(){
    bodyHeight(100);
  },
  destroyed(){
    bodyHeight();
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.register{
  height: 100%;
}
header{
  height: .88rem;
  background: #fff;
  width: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  i{
    float: left;
    width: .88rem;
    height:100%;
  }
  .iconfont{ 
    text-align: center;
    line-height: .88rem;
    font-size: .4rem;
  }
  .icon-fanhui{
    font-size: .38rem;
  }
  span{
    float: left;
    width: calc(100% - .88rem*2);
    width: -moz-calc(100% - .88rem*2);
    width: -webkit-calc(100% - .88rem*2);
    height:100%;
    text-align: center;
    line-height: .88rem;
    img{
      display: inline-block;
      vertical-align: middle;
      width: 20%;
    }
    sub{
      font-size: .25rem;
    }
  }
}
.register-alert{
  width: 100%;
  height: calc(100% - .88rem);
  height: -moz-calc(100% - .88rem);
  height: -webkit-calc(100% - .88rem);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  padding: .44rem;
  text-align: center;
  dl{
    width: 100%;
    height:100%;
    background: #fff;
    dt{
      padding-top: 1rem;
      img{
        display: inline-block;
        width: 50%;
        height: auto;
      }
      .proof-img{
        width: 60%;
      }
    }
    dd{
      font-size: .26rem;
    }
  }
  
}
.register-alert1{
  padding-top: 1.3rem;
}
.register-alert2{
  padding: .3rem 0 .4rem;
  span{
    color: #009e4d;
    display: inline-block;
    background: #D9F1E4;
    height: .4rem;
    line-height: .4rem;
    border-radius:.4rem;
    -moz-border-radius: .4rem;
    -webkit-border-radius: .4rem;
    font-size: .26rem;
    padding: 0 .2rem;
  }
}
.register-alert3{
  padding-bottom: .3rem;
}
</style>