<template>
  <div class="home">

    <!-- <header class="index-header">
        <span slot="head-center" @click="indexSelctSite">
          <img src="/static/images/jishi.png">
          <sub v-text="selectSiteInfo.region"></sub>
        </span>
        <router-link tag="i" :to="{path:'/search'}" slot="head-right" class="iconfont icon-sousuo"></router-link>
    </header> -->

    <header class="index-header">

      <span class="home-site" @click="indexSelctSite">
        <a href="javascript:;" v-text="selectSiteInfo.region"></a>
      </span>

      <span class="home-logo"><img src="/static/images/jishi.png"></span>

      <router-link tag="i" :to="{path:'/search'}" slot="head-right" class="iconfont icon-sousuo"></router-link>

    </header>

    <div style="height:.88rem;width:100%;"></div>
 
    <section class="index-banner" v-if="selectSiteInfo.id == '' ">
      <mt-swipe :auto="4000"  class="banner">
        <mt-swipe-item v-for="(item,index) in bannerList" key="index">
          <a v-bind:href="item.ad_link==''?'javascript:;':item.ad_link">
            <img :src='imgPre + item.ad_code' :onerror="imgErr" />
          </a>
        </mt-swipe-item>
      </mt-swipe>
    </section>

    <section class="index-siteBanner" v-if="selectSiteInfo.id != '' ">
      <a href="javascript:;">
        <img :src='imgPre + selectSiteInfo.mobileImg' :onerror="imgErr" />
      </a>
      
    </section>

    <section class="index-classify-entry">
      <ul>
        <li v-for="(item,index) in level1">
          <router-link :to="{name:'classifyDetail',params:{id:item.id}}">
            <img :src="'/static/images/c'+index+'.png'" />
            <i v-text="item.name">一级分类名称</i>
          </router-link>
        </li>
      </ul>
    </section>

    <!-- 全国地域 的推荐商品 -->
    <section class="index-goods-wrap"  v-if="selectSiteInfo.id == '' ">
      <dl v-for="(item,index) in wideCategory" key="index">
        <dt>
          <i>{{item.name}}</i>
          <router-link tag="span" :to="{name:'classifyDetail',params:{id:item.id}}">
            更多
            <i class="iconfont icon-weibiaoti-"></i>
          </router-link>
        </dt>

        <router-link tag="dd" 
          class="index-goods" 
          v-for="(items,index) in item.products" key="index"
           v-if="index < 4"
          :to="{name:'detail',params:{id:items.goods_id}}"
        >
          <p class="index-img-wrap">
            <img :src="imgPre + items.image.image_url" :onerror="imgErr" />
          </p>
          <p class="index-title-wrap">{{items.goods_name}}</p>
          <p class="index-price-wrap" v-if="items.price != -1">
            <i class="iconfont icon-weibiaoti-4"></i>
            <span v-text="items.price"></span>
          </p>
          <p class="index-alert-wrap" v-if="items.price == -1">认证可见</p>
        </router-link>

      </dl>
    </section>
    
    <!-- 非全国地域 的推荐商品 -->
    <section class="index-goods-wrap"  v-if="selectSiteInfo.id != '' ">
      <dl v-for="(item,index) in goodsList" key="index">
        <dt>
          <i>{{item.name}}</i>
          <router-link tag="span" :to="{name:'classifyDetail',params:{id:item.id}}">
            更多
            <i class="iconfont icon-weibiaoti-"></i>
          </router-link>
        </dt>

        <router-link tag="dd" 
          class="index-goods" 
          v-for="(items,index) in item.goods" key="index"
          :to="{name:'detail',params:{id:items.goods_id}}"
        >
          <p class="index-img-wrap">
            <img :src="imgPre + items.image.image_url" :onerror="imgErr" />
          </p>
          <p class="index-title-wrap">{{items.goods_name}}</p>
          <p class="index-price-wrap" v-if="items.price != -1">
            <i class="iconfont icon-weibiaoti-4"></i>
            <span v-text="items.price"></span>
          </p>
          <p class="index-alert-wrap" v-if="items.price == -1">认证可见</p>
        </router-link>

      </dl>
    </section>

    <div style="width:100%;height:.98rem;"></div>
      
    <!-- 站点选择弹出层 -->
    <mt-popup v-model="popupVisible" position="right" :modal="false">

      <div class="mtHeader">
        <pageHead>
          <i slot="head-left" class="iconfont icon-guanbi" @click="popupVisible = false"></i>
          <span slot="head-center">选择地域</span>
        </pageHead>
      </div>

      <dl class="site-wrap">
        <dt>
          <span>找美食，先从挑选地域开始吧</span>
        </dt>

        <dd class="site-title">当前选择</dd>
        <dd>
          <a class="siteActive" href="javascript:;" v-text="selectSiteInfo.region" @click="popupVisible = false,overFlow('auto');"></a>
        </dd>

        <dd class="site-title">全部地域</dd>
        <dd>
          <a href="javascript:;" 
            v-for="(item,index) in siteList"
            @click="selectSite(item.id,item.region,item.mobile_img)">
            {{item.region}}
          </a>
        </dd>
      </dl>
    </mt-popup>

  </div>
</template>

<script>
import pageHead from '@/components/head'
import { overFlow,bodyHeight } from '@/assets/public/function'

export default {
  name: 'home',
  data (){
    return {
      imgPre:this.$api.imgPre,                                  // 图片前缀
      popupVisible:false,                                       // 地域选择模态框
      selectSiteInfo:this.$store.state.selectSiteInfo,          // 首页选中的地域信息
      siteList:[],                                              // 地域信息
      level1:[],                                                // 一级分类
      bannerList:[],                                            // 轮播图
      goodsList:[],                                             // 其他地域 首页商品信息
      wideCategory:[],                                          // 全国地域 首页商品信息
      siteBanner:'',
      // scrollArr:[],                                             // 滚动条高度
      imgErr:'this.src="/static/images/imgtem.png"'
    }
  },
  watch:{
    popupVisible:{
      handler(a,b){
        a?overFlow():overFlow("auto");
      },
      deep:true
    }
  },
  components: {
    pageHead
  },
  created(){
    this.getLevel1();
    this.getBanner();
    bodyHeight();
    this.getCategoryProducts(); 
  },
  mounted: function() {
    // 清除分类详情页 分类级别信息
    this.$store.commit('setClassArr',[]);
    // console.log(this.$store.state.classArr)

    this.$nextTick(function(){
      window.addEventListener('scroll', this.onScroll)
    })

    document.activeElement.blur();
    
  },
  methods:{
    // 滚动条滚动事件
    // onScroll(){
    //   let scrolldistance = document.documentElement.scrollTop || 
    //                         window.pageYOffset || 
    //                         document.body.scrollTop;
    //   this.scrollArr.push(scrolldistance);
    //   this.scrollArr = this.scrollArr.slice(-2);
    //   // console.log(this.scrollArr)
    //   this.$store.commit('setScrollTop',this.scrollArr);
    // },
    // 获取banner
    getBanner(){
      const _this = this;
      this.$axios({
        url:this.$api.home.banner,
        params:{
          pid:1
        }
      }).then(function(res) {

        _this.bannerList = res.data.data;
        // console.log(_this.bannerList)

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    },
    // 首页点击 logo
    indexSelctSite(){
      this.popupVisible = true;
      this.getSiteList();
      overFlow();
    },

    // 获取地域列表
    getSiteList(){
      const _this = this;
      this.$axios({
          url:this.$api.home.getSite
      }).then(function(res) {

        _this.siteList = res.data.data;

        // console.log(_this.siteList)

        // 地域列表中没有全国地域 将全国推入地域列表
        _this.siteList.unshift({
          id:'',
          region:'全国',
          mobile_img:''
        });

        // 已经选择的地域（默认选中全国） 不出现在全部地域中
        for(let i in _this.siteList){
          if(_this.selectSiteInfo.id == _this.siteList[i].id){
            _this.siteList.splice(i,1);
          }
        }

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    },

    // 选择地域
    selectSite(id,region,img){

      this.popupVisible = false;

      // 修改vuex中的站点信息
      let siteInfo = {
        id:id,
        region:region,
        mobileImg:img
      }
      this.$store.commit('reSiteInfo',siteInfo);

      overFlow('auto');

      this.getIndexList();
    },

    // 根据 地域 获取首页列表信息
    getIndexList(){
      const _this = this; 
      // 清空商品数组
      _this.goodsList = [];

      // 循环请求 该站点下各个一级分类下的商品信息 默认分页为 1 每个分类下最多只需要四条数据
      for(let i in this.level1){
        this.$axios({
          url:this.$api.search.searchcategory,
          params:{
            id:this.level1[i].id,
            site_id:this.selectSiteInfo.id,
            page: 1
          }
        }).then(function(res) {

          // console.log(res)

          if(res.data.data.goods_list.length != 0){

            // 分类信息 与 商品信息 推入商品信息数组
            let arrTem = _this.level1[i];
            arrTem.goods = res.data.data.goods_list.slice(0,4);
            _this.goodsList.push(arrTem)

          }

        }).catch(function (error) {
          // _this.$toast('系统繁忙'); 
        });
      }
    },

    // 获取全国 推荐商品
    getCategoryProducts(){
      const _this = this;
      
        this.$axios({
          url:this.$api.home.category_products
        }).then(function(res) {

          _this.wideCategory = res.data.data

        }).catch(function (error) {
          // _this.$toast('系统繁忙'); 
        });
      
    },

    // 获取一级分类
    getLevel1(){
      const _this = this;
      this.$axios({
          url:this.$api.home.getlevel1
      }).then(function(res) {

        // 将一级分类中的 地域 删除
        _this.level1 = res.data.data.slice(1);

        // console.log(_this.level1)

        _this.getIndexList();

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.temInput{
   width:0;
   height:0;
   visibility:hidden;
   padding:0;
   margin: 0;
   border: 0;
}
.home{
  height: 100%;
}
.mint-swipe-items-wrap{
  img{
    width: 100%;
    height: auto;
  }
}
.index-price-wrap{
  color: #eb3d24;
  padding: .1rem 0;

  i{
    font-size: .26rem;
  }
  span{
    font-size: .3rem;
  }
}
.index-title-wrap{
  padding: .1rem 0;
  white-space: nowrap;
  width: 100%;
  height: .57rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.index-img-wrap{
  height: 3.6rem;
  img{
    width:100%;
    height: auto;
    display: inline-block;
  }
}
.index-goods{
  padding: .2rem;
  a{
    display: block;
  }
  float: left;
  width: 50%;
  text-align: center;
  font-size: .26rem;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  &:before{
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 200%;
    height: 1px;
    border-bottom: 1px solid #eee;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  &:after{
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    height: 200%;
    border-right: 1px solid #eee;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  &:nth-of-type(2n):after{
    border-right-color:transparent;
  }

}
.index-alert-wrap{
  padding: .1rem 0;
  color: #009e4d;
}
.index-goods-wrap{
  width: 100%;
  overflow: hidden;
  background: #fff;
  dl{
    overflow: hidden;
    border-bottom: .12rem solid #eee;
  }
  dt{
    height: .86rem;
    line-height: .86rem;
    font-weight: 900;
    padding: 0 .3rem;
    overflow: hidden;
    position: relative;
    &:after{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 200%;
      height: 1px;
      border-bottom: 1px solid #eee;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scale(.5,.5);
      transform: scale(.5,.5);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      z-index: 990;
    }
    &:before{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 200%;
      height: 1px;
      border-bottom: 1px solid #eee;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scale(.5,.5);
      transform: scale(.5,.5);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      z-index: 990;
    }
    i{
      float: left;
    }
    span{
      float: right;
      font-size: .24rem;
      color: #999;

      i{
        float: right;
        font-size: .2rem;
        padding-left: .06rem;
      }
    }
  }
}
.index-classify-entry{
  width: 100%;
  overflow: auto;
  background: #fff;
  margin-bottom: .12rem;
  position: relative;
  &:before{
    content: '';
    position: absolute;
    width: 100%;
    height: .2rem;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 88;
  }
  ul{
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 0 .15rem;
    li{
      display: inline-block;
      width: 1.5rem;
      text-align: center;
      a{
        padding: .3rem 0 .2rem;
        display: block;
        i{
          padding-top: .05rem;
          display: block;
          font-size: .26rem;
          color: #333;
        }
        img{
          width: 50%;
          height: auto;
          display: inline;

        }
      }
      
    }
  }
}
footer{
  height: .88rem;
  width: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
}
.index-banner{
  overflow: hidden;
  height: 3.75rem;
  a{
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
    img{
      height: 100%;
      width: auto;
      display: inline-block;
    }
  }
}
.site-title{
  font-size: .28rem;
  margin: .3rem 0 .3rem;
}
.site-wrap{
  padding:0 .3rem;
  a{
    float: left;
    border: 1px solid #cbcbcb;
    height: .56rem;
    width: 1.72rem;
    text-align: center;
    line-height: .6rem;
    color: #333;
    font-size: .3rem;
    border-radius: .04rem;
    -moz-border-radius: .04rem;
    -webkit-border-radius: .04rem;
    margin:0 .4rem .24rem;
    &:nth-child(3n+1){
      margin:0 .4rem .24rem 0;
    }
    &:nth-child(3n+3){
      margin:0 0 .24rem .4rem;
    }
  }
  .siteActive{
    border-color:#009e4d;
    color: #009e4d; 
  }
  dd{
    overflow: hidden;
  }
  dt{
    text-align: center;
    position: relative;
    margin:.2rem 0 .1rem;
    &:before{
      content: '';
      position: absolute;
      width: 140%;
      height: 1px;
      top: 50%;
      left:15%;
      border-bottom: 1px solid #009e4d;
      z-index: 999;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scale(.5,.5);
      transform: scale(.5,.5);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    span{
      position: relative;
      z-index: 99999;
      display: inline-block;
      width: 3.8rem;
      font-size: .24rem;
      background: #eee;
      color: #009e4d;
      
    }
  }
}

.mint-popup-right{
  width: 100%;
  height: 100%;
  background: #eee;
  .mint-header{
    background: #fff;
    height: .88rem;
    color: #333;
    font-size: .35rem;
  }
}
.mtHeader{
  background: #fff;
  height: .88rem;
  color: #333;
  font-size: .35rem;
}
.index-header{
  height: .88rem;
  background: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  line-height: .88rem;
  &:before{
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 200%;
    height: 1px;
    border-top: 1px solid #eee;
    background: #eee;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 999;
  }
  .home-site{
    width: 1.5rem;
    height: 100%;
    float: left;
    padding-left: .3rem;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    a{
      padding-right: 8px;
      position: relative;
      font-size: .28rem;
      &:before{
        content: '';
        position: absolute;
        right: 0;
        bottom: 4px;
        border: 3px solid #666;
        border-top-color: transparent;
        border-left-color: transparent;
      }

    }
  }
  .home-logo{
    width: calc(100% - 3rem);
    text-align: center;
    float: left;
    height: 100%;
    img{
      display: inline-block;
      width: 45%;
      margin-top: .25rem;
    }
  }
  i{
    float: left;
    width: 1.5rem;
    height:100%;
    text-align: right;
    line-height: .88rem;
    font-size: .4rem;
    padding-right: .3rem;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
  }
}
.index-center{
  height: calc(100% - .88rem*2);
  height: -moz-calc(100% - .88rem*2);
  height: -webkit-calc(100% - .88rem*2); 
  position: fixed;
  top: .88rem;
  bottom:.88rem;
  right: 0;
  left: 0;
  overflow: hidden;
}
.index-center-wrap{
  width: 100%;
  height: 100%;
  overflow-y:auto; 
}
.index-siteBanner{
  width: 100%;
  height: 3.75rem;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
