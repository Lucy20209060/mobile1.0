<template>
  <div class="shopCart"  >

    <div style="height: .88rem;background-color: #fff;"></div>

    <header>
      <pageHead>
        <i slot="head-left" class="iconfont icon-fanhui" @click="goBack"></i>
        <span slot="head-center">购物车</span>
        <button slot="head-right" v-if="cartList.length!=0 && mobile!='' && mobile != '-1'" @click="showDelGoods">{{delActive==0?'编辑':'完成'}}</button>
      </pageHead>
    </header>

    <div class="login" v-if="mobile!='' && !cartnone" v-show="bAll">
      <div class="shopcart-wrap">
        <div class="carList">
          <div class="carCase" v-for="(item, index) in cartList" key="index">

            <div class="caricon" @click="selfCheck(item)">
              <i class="iconfont"  
                :class="[item.selected==1?'icon-xuanze getChecked':'icon-xuanze1 getNone']" 
                v-if="Number(item.is_on_sale) == 1 && Number(item.store_count) != 0 && Number(item.goods_num) <= Number(item.store_count)"
              >              
              </i>
              <span class="shixiaoshow" 
                v-if="Number(item.store_count) == 0 || Number(item.is_on_sale) == 0 || Number(item.goods_num) > Number(item.store_count)"
              >
              失效
              </span>
            </div>

            <router-link :to="{name:'detail',params:{id:item.goods_id}}">
              <img :src="imgPre + item.image.image_url" :onerror="imgErr" />
            </router-link>

            <div class="cartInfo">
              <p :class="[item.is_on_sale == 1? 'huise' : 'heise']">{{ item.goods_name}}</p>
              <p >{{ item.spec_key_name }}</p>
              <p v-if="Number(item.is_on_sale) == 1&&Number(item.store_count) != 0&&Number(item.goods_num) <= Number(item.store_count)">
                <i class="iconfont icon-weibiaoti-4"></i>
                &nbsp;{{ item.member_goods_price }}
              </p>
              <span class="nogoods" 
                v-if="Number(item.store_count) == 0||Number(item.goods_num) > Number(item.store_count)&& Number(item.is_on_sale)==1"
                >
                该商品库存不足
              </span>
              <span class="shixiao" v-if="Number(item.is_on_sale) == 0">该商品已下架</span>
            </div>
            <div class="numBox">
              <ul>
                <li @click="downNum(item)">-</li>
                <li>{{ item.goods_num }}</li>
                <li @click="addNum(item)">+</li>
              </ul>
            </div>
          </div>   
        </div>

        <div style="height: 1.86rem;"></div> 

        <div class="allChoose">
          <div @click="allCheck()"><i class="iconfont" :class="[bWatchAll==false?'getNone icon-xuanze1':' icon-xuanze getChecked']"></i></div>全选
          <p v-show="!delCheck">共:￥<i>{{ zongjia }}</i></p>
          <span v-show="delCheck" @click="delAlert">删除所选</span>
        </div>
        <div class="buytoast" v-if="zongjia != 0 && delCheck == false">        
          <span><i class="iconfont icon-tishi"></i>商品已放进购物车喽,请在PC端进行支付</span>
          <div class="arrow-down"></div>
        </div>
        <div class="delToast" v-show="delShow">
          <p>是否清除所选的商品</p>
          <ul>
            <li @click="showCancel">取消</li>
            <li @click="delSure">确定</li>
          </ul>
        </div>
      </div>      
    </div>

    <transition name="fade">
      <div class="screen-cover" v-show="delShow"></div>  
    </transition>

    <div class="shopcart-empty" v-if="cartnone && mobile!=''&& mobile !=-1" :style="{height:clientHeight+'px'}">
      <img src="/static/images/shopcart.png"></br>
      <div>购物车暂无商品</div></br>
      <router-link to="/home"><span class="logbtn">去逛逛</span></router-link>
    </div> 

    <div class="loginout" v-if="mobile==''" :style="{height:clientHeight+'px'}" v-show="!bAll">
      <img src="/static/images/shopcart.png"></br>
      <router-link to="/login"><span class="nowlogbtn">立即登录</span></router-link>    
    </div> 

    <mt-spinner color="rgb(100, 100, 100)" :size="40" type="fading-circle" style="position: fixed;top: 50%;left: 3.4rem;" v-if="mobile == '-1'"></mt-spinner>
  </div>
</template>



<script>
import { Toast } from 'mint-ui';
import pageHead from '@/components/head'
import { bodyHeight } from '@/assets/public/function'
import { getCookie, delCookie } from '@/assets/public/cookie'
export default {
  name: 'shopCart',
  data (){
    return {
      imgPre:this.$api.imgPre, //图片前缀
      mobile: -1, //用户名
      cartList: [] , //购物车列表
      cartnone: false, //购物车为空状态
      checkStatus: true, //商品被选中状态
      getCheck: false,  //全选按钮选中背景色
      delCheck: false, //删除所选按钮隐藏
      delActive: 0, //编辑按钮默认状态
      delShow: false, //删除确认弹框
      zongjia: 0, //商品总价
      updateInfo:{ // 更新数据所需参数
         cart_select:{},
         goods_num:{}
      },
      singleSelectNum: [], //被删除的商品的数量
      singleSelectId: [], //被删除的商品ids列表
      ids: '', //被删除商品的id
      bWatchAll: false, //全选监听
      imgErr:'this.src="/static/images/kongb.png"',
      clientHeight:document.documentElement.clientHeight,    // 屏幕高度
      bAll: false 
    }
  },
  created() {
    // _this.mobile = _this.$store.state.userInfo.mobile;
  },
  components: { pageHead },
  mounted(){
    const _this = this;
    setTimeout(function(){
      _this.mobile = _this.$store.state.userInfo.mobile;
      if(_this.mobile != ''){
        _this.bAll = true;
       }else{
        _this.bAll = false;
      }
    },500);
    this.getGoodsList();
    
  },
  methods:{
    //完成和编辑的切换
    showDelGoods() {
      var _this = this;
      for(let i in _this.cartList) {
        _this.cartList[i].selected = 0;
        _this.bWatchAll = false;
        _this.singleSelectId = [];

      }
      
      if (_this.delCheck == false) {
        _this.delCheck = true;
        _this.delActive = 1;
      }else{
        _this.delCheck = false;
        _this.delActive = 0;
      }
      _this.getInfo();
      _this.changeNum();
    },
    
    //删除所选按钮
    delAlert() {
      for(let i in this.cartList){
        // 存在选中 才能删除
        if(this.cartList[i].selected == 1){
          this.delShow ? this.delShow = false: this.delShow = true;
          return false;
        }
      }

      // 没有选中 提示选择商品
      this.$toast({
        message: '请选择商品',
        position: 'center',
        duration: 1000
      });

    },
    //取消删除
    showCancel() {
      this.delShow = false;
    },
    //确认删除
    delSure() {
      var _this = this;
      _this.ids = _this.singleSelectId.join(",");
      _this.delShow = false;
      _this.delActive = 0;
      _this.delCheck = false;
      this.delGoods();
    },
    //增加
    addNum(item) {
      if(Number(item.goods_num) < Number(item.store_count)) {
        item.goods_num++;        
      }else{
        item.goods_num = item.store_count;
      }
      this.getInfo();
      this.changeNum(item.goods_num,item.id)
    },
    //减少
    downNum(item) {
      if(item.goods_num < 2) {
        item.goods_num = 1;
      }else{
        item.goods_num --;
      }
      this.getInfo();
      this.changeNum(item.goods_num,item.id)
      
    },
    //单选
    selfCheck(item) {
      if ((item.is_on_sale == 0) || (item.store_count==0) || (Number(item.goods_num) >= Number(item.store_count))) {
        return false;
      }
      this.singleSelectId = [];
      if(item.selected == 0) {
        item.selected = 1;
      }else{
        item.selected = 0;
      }

      this.bWatchAll = true;

      for(let i=0,len=this.cartList.length;i<len;i++) {

        if(this.cartList[i].selected == 0) {
          this.bWatchAll = false;
        }else{
          this.singleSelectId.push(this.cartList[i].id);
         
        }
        this.getInfo();
        this.changeNum(item.goods_num,item.id);
        this.totalPrice();
      }
    },
    //全选
    allCheck() {
      var _this = this;
      this.bWatchAll = !this.bWatchAll;  
      for(let i=0,len=this.cartList.length;i<len;i++) {
        if(this.bWatchAll){
          this.cartList[i].selected = 1;
          this.singleSelectId.push(this.cartList[i].id);
        }else{
          this.cartList[i].selected = 0;
          this.singleSelectId = [];
        }
      }
      _this.getInfo();
      _this.changeNum();
      _this.totalPrice();
    },
    //获取商品列表请求
    getGoodsList() {
      let _this = this;
        _this.getInfo();
        _this.changeNum();
      _this.$axios({
        dataType: "json",
        methods: "get",
        url:this.$api.shopCart.getGoodsList
      }).then(function(res){
        _this.cartList = res.data.data.cartList;

        _this.totalPrice();
        if(_this.cartList.length == 0) {
          _this.cartnone = true;
        }else{
          _this.cartnone = false;
        }
        //更新商品列表，比对库存和当前的商品数量
        // for(let i in _this.cartList) {
        //   if(_this.cartList[i].goods_num >= _this.cartList[i].store_count) {
        //     _this.cartList[i].goods_num = _this.cartList[i].store_count;    
        //   }
        // }
        //请求后台数据，更新数量
        // _this.getInfo();
        // _this.changeNum(); 
        

        //切换全选状态
        for(let i in _this.cartList) {
          if(_this.cartList[i].selected == 0) {
            _this.bWatchAll = false;
            return false;
          }else{
            _this.bWatchAll = true;
          }
        }

        
      }).catch(function(error){

      })
    },
    //改变商品数量请求
    changeNum() {
      let _this = this;
      let params = {
         'cart_select':this.updateInfo.cart_select,
         'goods_num':this.updateInfo.goods_num,
      }
      this.$axios.post(this.$api.shopCart.updateHttp,params).then(function(res){
        _this.cartList = res.data.data.cartList;
        if(_this.cartList.length == 0) {
          _this.cartnone = true;          
        }else{
          _this.cartnone = false;
        }

        _this.totalPrice();
      }).catch(function(error){

      })
    },

    //获取商品数量改变所需参数
    getInfo() {
      for(let i=0,len=this.cartList.length;i<len;i++){
        this.updateInfo.cart_select[this.cartList[i].id]=this.cartList[i].selected;
        this.updateInfo.goods_num[this.cartList[i].id]=this.cartList[i].goods_num;
      }
    },
    //删除请求
    delGoods() {
      let _this = this;
      if(_this.cartList.length == 0) {
        _this.bWatchAll = true;
      }
      let ids = {
        'ids':this.ids
      }
      _this.$axios.post(this.$api.shopCart.removeHttp,ids).then(function(data){
        _this.getGoodsList();
        _this.getInfo();
        _this.changeNum();
        _his.totalPrice();
      }).catch(function(error){

      })

    },
    //计算总价
    totalPrice() {
      this.zongjia = 0;

      for(let i in this.cartList) {
        let jianshu = 0;
        if((this.cartList[i].is_on_sale != 0) &&(this.cartList[i].store_count != 0)&&(Number(this.cartList[i].goods_num) <= Number(this.cartList[i].store_count))) {
          if(this.cartList[i].selected == '1') {
            jianshu ++;
            this.zongjia =+ this.zongjia + this.cartList[i].member_goods_price*this.cartList[i].goods_num;
            this.zongjia = this.zongjia.toFixed(2);
          }

        }

      }
    },
    //返回上一页
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.shopCart {
  height: 100%;
  background-color: #fff;
}
header{
  height: .88rem;
  background: #fff;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
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
  button {
    border: none;
    color: #333;
    background-color: #fff;
    height: .85rem;
    font-size: .28rem;
    line-height: .95rem;
  }
}
footer{
  height: .88rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.loginout {
  width: 100%;
  height: calc(100% - .88rem);
  height: -webkit-calc(100% - .88rem);
  height: -moz-calc(100% - .88rem);
  overflow: auto;
  padding: 2rem 0 .1rem;
  text-align: center;
  background-color: #fff;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  img {
    display: inline-block;
    width: 30%;
  }
  a {
    display: inline-block;
    height: .6rem;
    width: 1.8rem;
    margin-top: .3rem;
    text-align: center;
    color: #009e4d;
    outline:none;
    -webkit-appearance: none;
    tap-highlight-color:rgba(0,0,0,0);
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
}

.logbtn {
  font-size: .28rem;
  background-color: #fff;
  height: 100%;
  line-height: .6rem;
  border: 1px solid #009e4d;
  color: #009e4d;
  margin-top: .52rem;
  outline:none;
  -webkit-appearance: none;
  tap-highlight-color:rgba(0,0,0,0);
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.nowlogbtn {
  height: 100%;
  width: 100%;
  display: inline-block;
  padding: 0 .1rem;
  line-height: .6rem;
  border: 1px solid #009e4d;
  border-radius: .1rem;
  outline:none;
  -webkit-appearance: none;
  tap-highlight-color:rgba(0,0,0,0);
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.shopcart-empty {
  height: calc(100% - .88rem);
  height: -moz-calc(100% - .88rem);
  height: -webkit-calc(100% - .88rem);
  overflow: auto ;
  text-align: center;
  padding: 2rem 0 .1rem;
  background-color: #fff;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  img {
    display: inline-block;
    width: 30%;
  }

  span {
    position: absolute;
    left: 2.85rem;
    height: .6rem;
    width: 1.8rem;
    font-size: .3rem;
    border-radius: .1rem;
  }
  a {
    height: .6rem;
    width: 1.8rem;
    color: #009e4d;
    display: inline-block;
    text-align: center;
    outline:none;
    -webkit-appearance: none;
    tap-highlight-color:rgba(0,0,0,0);
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  div {
    width: 2.5rem;
    display: inline-block;
    margin-top: .68rem;
    font-size: .3rem;
  }
}
.login {
  height: calc(100% - .88rem);
  height: -webkit-calc(100% - .88rem);
  height: -moz-calc(100% - .88rem);
  background-color: #eee;
}
.shopcart-wrap {
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #eee;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  a {
    float: left;
    img {
      margin: .29rem 0;
      width: 1.3rem;
      height: 1.3rem;
    }
  }
  p: nth-of-type(1) {
    height: 1.88rem;
  }
  .caricon {
    float: left;
    width: .92rem;
    outline:none;
    -webkit-appearance: none;
    tap-highlight-color:rgba(0,0,0,0);
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    i {
      margin: .8rem .3rem 0 .3rem;
      line-height: .32rem;
      text-align: center;      
    }


  }
  .cartInfo {
    float: left;
    padding: .29rem 0 0 .3rem;
    p {
      display: block;
    }
    p:nth-of-type(2) {
      font-size: .2rem;
      color: #999;
      height: .22rem;
      padding: .10rem 0 .3rem 0;
    }
    p:nth-of-type(3) {
      font-size: .26rem;
      color: #eb3d24;
      i {
        font-size: .24rem;
      }
    }
  }
  
}
.heise {
  font-size: .26rem;
  line-height: .38rem;
  height: .38rem;
  width: 4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
.huise {
  @extend .heise;
  color: #333;
}
.carCase {
  position: relative;
  height: 1.9rem;
  min-width: 3.2rem;
  margin-bottom: .06rem;
}
.allChoose {
  position: fixed;
  bottom: .88rem;
  height: .88rem;
  width: 100%;
  background-color: #fff;
  line-height: .88rem;
  div {
    float: left;
    i {
      margin: .26rem .3rem 0 .3rem;
      line-height: .32rem;
      text-align: center;
    }
  }
  p {
    float: right;
    color: #eb3d24;
    i {
      margin-right: .3rem;
    }
  }
  span {
    position: absolute;
    right: 0;
    width: 3rem;
    text-align: center;
    background-color: #009e4d;
    color: #fff;
  }
}
.buytoast {
  height: .6rem;
  line-height: .6rem;
  vertical-align: center;
  padding: 0 .2rem 0 .2rem;
  border-radius: .2rem;
  position: fixed;
  right: .3rem;
  bottom: 1.7rem;
  color: #333;
  background-color: #fff;
  box-shadow: 0rem 0rem .3rem .1rem #eee;
  span {
    font-size: .26rem;
    i {
      font-size: .26rem;
      color: #009e4d;
      margin-right: .1rem;
    }
  }
  
}
.arrow-down {
  width:0px;
  height:0px;
  position: absolute;
  right: .4rem;
  bottom: -0.2rem;
  border-left:.24rem solid transparent;
  border-right:.24rem solid transparent;
  border-top: .24rem solid #fff;
  font-size:0px;
  line-height:0px;
}
.getNone {
  display: inline-block;
  width: .32rem;
  height: .32rem;
  font-size: .32rem;
  line-height: .32rem;
  color: #999;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.getChecked {
  display: inline-block;
  width: .32rem;
  height: .32rem;
  line-height: .32rem;
  color: #009e4d;
  font-size: .32rem;
}
.checkbgno {
  display: inline-block;
  width: .32rem;
  height: .32rem;
  margin: .70rem .3rem;
  text-align: center;
  line-height: .32rem;
  border-radius: 50%;
}
.carCase {
  background-color: #fff;
}
.numBox {
  position: absolute;
  right: .3rem;
  top: .9rem;
  ul {
      height: .6rem;
      line-height: .62rem;
      margin-left: .3rem;
      border: 1px solid #eee;
      li {
        float: left;
        width: .6rem;
        text-align: center;
        border-right: 1px solid #eee;
      } 
      li:nth-of-type(3) {
        border: none;
      }
      input {
        width: 100%;
        height: .6rem;
        border: none;
        text-align: center;
      }
    }
}
.screen-cover {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 15;
}
.delToast {
  position: fixed;
  top: 4rem;
  left: 1.5rem;
  width: 4.5rem;
  height: 3rem;
  background-color: #fff;
  z-index: 16;
  border-radius: .1rem;
  p {
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    font-size: .3rem;
    border-bottom: 1px solid #eee;
  }
  ul {
    display: flex;
    li {
      flex: 1;
      color: #009e4d;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
    }
  }

}
.tishi {
  height: .3rem;
  i {
    font-size: .26rem;
  }
}
.shixiao {
  font-size: .26rem;
}
.shixiaoshow {
  display: inline-block;
  width: .56rem;
  height: .34rem;
  text-align: center;
  color: #fff;
  line-height: .38rem;
  margin: .75rem .15rem 0 .15rem;
  font-size: .18rem;
  border-radius: .16rem;
  background-color: #aaa;
}
.nogoods {
  font-size: .26rem;
}
</style>