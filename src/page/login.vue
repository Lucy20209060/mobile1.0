<template>
  <div class="login">
    <!-- logo -->
    <p class="login-logo">
      <router-link :to="{path:'/home'}">
        <img src="/static/images/jishi.png">
      </router-link>
    </p>
    <!-- 手机号输入框 -->
    <p class="phone-wrap">
      <span>
        <input type="tel"
          v-focus  
          placeholder="手机号" 
          maxlength="11" 
          v-model="phoneNumber" 
          @input="telEntry($event)" 
        />
        <i class="iconfont icon-guanbi" @click="clearInput"></i>
      </span>
    </p>
    <!-- 密码输入框 -->
    <p class="password-wrap">
      <span>
        <input type="password" maxlength="16" placeholder="密码" v-model="passWord" @input="passWordEntry($event)" />
      </span>
    </p>
    <!-- 登录按钮 -->
    <p class="login-btn-wrap" v-bind:class="{enterBtnActive:enterBtnSign}">
      <a href="javascript:;" @click="enterBtn(enterBtnSign)">登录</a>
    </p>
    <!-- 注册链接 -->
    <p class="goRegister-wrap">
      <router-link :to="{path:'/register/1'}">注册>></router-link>
    </p>
  </div>
</template>

<script>
import { bodyHeight } from '@/assets/public/function'
export default {
  name: 'login',
  data (){
    return {
      phoneNumber:'',       // 电话号码输入框
      passWord:'',          // 密码输入框

      telSign:false,        // 电话号码开关
      passwordSign:false,   // 密码开关
      enterBtnSign:false,   // 按钮开关
      
      user_id:'',           // 用户id
      is_verify:'',         // 认证状态
      mobile:''             // 用户电话号码
    }
  },
  mounted(){
    bodyHeight(100);
    // this.$refs.logininput.focus();
  },
  destroyed(){
    bodyHeight();
    // this.$refs.logininput.blur();
  },
  directives:{
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  methods:{
    // 登录 按钮
    enterBtn(value){

      // 按钮状态未开启 return false
      if(!value){
        return false;
      }

      var _this = this;
      this.$axios({
          method:'get',
          url:this.$api.login.login,
          params:{
            username:this.phoneNumber,
            password:this.passWord
          }
      }).then(function(res) {

        if(res.data.status == 200 && !res.data.code){ // 登录成功

          _this.user_id = res.data.user_id;

          _this.getUserInfo();

        }else{

          _this.$toast({
            message: res.data.msg,
            position: 'center',
            duration: 1000
          });

        }

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });

    },

    // 获取用户信息
    getUserInfo(){
      const _this = this;
      this.$axios({
        url:_this.$api.login.getUserInfo,
        params:{
          user_id:_this.user_id
        }
      }).then(function(res) {
        

        let Info = {
          user_id:res.data.result.user_id,
          is_verify:res.data.result.is_verify,
          mobile:res.data.result.mobile
        }

        // console.log(Info)

        _this.$store.commit('reuserInfo',Info)

        _this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        setTimeout(() => {

            _this.$indicator.close();

            if(_this.$store.state.urlHistory == null ){
              _this.$router.push('/home');
            }else{
              _this.$router.push(_this.$store.state.urlHistory);
            }
            
        }, 1000);

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    },

    // X 清空输入框
    clearInput(){
      this.phoneNumber = '';
      this.enterBtnSign = false;
      this.$refs.logininput.focus();
    },

    // 手机号检测
    telEntry(e){

      let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i,
          number = e.srcElement.value;

      if(number.substring(0,1) == ''){
        return false;
      }

      if(number.substring(0,1) != 1){

        this.telSign = false;

        this.$toast({
          message: `首位不能为 ${number.substring(0,1)}`,
          position: 'center',
          duration: 1000
        });
      }

      if(number.length ==11){

        // 手机号格式正确 开启手机号状态
        if(!reg.test(this.phoneNumber)){

          this.telSign = false;

          this.$toast({
            message: '电话号码格式错误',
            position: 'center',
            duration: 1000
          });

        }else{
          this.telSign = true;
        }

      }else{
        this.telSign = false;
      }

      // 手机号 密码 条件满足 开启按钮
      if(this.telSign && this.passwordSign){
        this.enterBtnSign = true;
      }else{
        this.enterBtnSign = false;
      }

    },

    // 密码检测
    passWordEntry(e){
      let number = e.srcElement.value;

      // 密码大于6位 开启密码状态
      if(number.length >= 6){
        this.passwordSign = true;
      }else{
        this.passwordSign = false;
      }

      // 手机号 密码 条件满足 开启按钮
      if(this.telSign && this.passwordSign){
        this.enterBtnSign = true;
      }else{
        this.enterBtnSign = false;
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login{
  height: 100%;
  background:#f5f4f2 url('/static/images/loginBg.png') no-repeat center bottom;
  background-size: 100% auto;
  -moz-background-size: 100% auto;
  -webkit-background-size: 100% auto;
  -o-background-size: 100% auto;
  text-align: center;
}
.login-logo{
  text-align: center;
  padding: 1.14rem 0;
  a{
    display: inline-block;
    width: 46%;
    img{
      width: 100%;
      height: auto;
    }
  }
  
}
.phone-wrap{
  padding: .11rem;
  text-align: center;
  color: #999;
  height: .8rem;
  span{
    display: inline-block;
    width: 6rem;
    height: 100%;
    position: relative;
    label{
      position: absolute;
      left: .23rem;
      top: .23rem;
    }
    input{
      width: 100%;
      height: 100%;
      border: 0;
      font-size: .32rem;
      color: #333;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 1.24rem 0 .24rem;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -o-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
    }
    .iconfont{
      position: absolute;
      z-index: 2222;
      width: .7rem;
      height: 100%;
      right: 0;
      top: 0;
      line-height: .8rem;
      font-size: .24rem;
    }
  }
}
.password-wrap{
  @extend .phone-wrap;
}
.login-btn-wrap{
  padding: .35rem 0 .2rem 0;
  text-align: center;
  height: .8rem;
  a{
    display: inline-block;
    width: 6rem;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    background: #d8d8d8;
    color: #fff;
    font-size: .3rem;
  }
}
.enterBtnActive a{
  background: #009E4D;
}
.goRegister-wrap{
  text-align: center;
  a{
    color: #009E4D;
    font-size: .3rem;
  }
  
}
</style>