<template>
  <div class="classifydetail">

    <div style="height:2.45rem;background:#eee;"></div>

    <header class="classifydetail-header">
      <pageHead>
        <i slot="head-left" class="iconfont icon-fanhui" @click="goBack"></i>
          <span slot="head-center" v-text="title"></span>
          <router-link tag="i" :to="{name:'search'}" slot="head-right" class="iconfont icon-sousuo"></router-link>
      </pageHead>
    </header> 
    
    <section class="classifydetail-nav">
      <ul ref="ul">
        <li v-for="(item,index) in subCategories" key="index">
          <a href="javascript:;" 
            :class="{aActive:item.id == selectSign}"
            v-text="item.name"
            @click="clickSub(item.id)"
          >下级分类</a>
        </li>
      </ul>  
    </section>

    <div class="classify-alert">你的吃相是最美的模样</div>


    <div class="search-result">
        
      <!-- 没有搜索结果 -->
      <div class="search-nosearch" v-if="goodsList.length == 0">
        <img src="/static/images/kongb.png">
        <p>暂无相关分类商品</p>
      </div>
      
      <!-- 搜索商品列表 -->
      <!-- <mt-loadmore 
        ref="loadmore" 
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :bottomAllLoaded="bottomLoaded"
      > -->
        <router-link v-for="(item,index) in goodsList" tag="ul" :to="{name:'detail',params:{id:item.goods_id}}" key="index">         
          <li class="search-img">
            <img :src="imgPre + item.image.image_url" :onerror="imgErr" />
          </li>
          <li class="search-title" v-text="item.goods_name">名称</li>
          <li class="search-price" v-if="item.price != -1">
            <i class="iconfont icon-weibiaoti-1"></i>
            {{item.price}}
          </li>
          <li class="search-mark" v-if="item.price == -1">认证可见</li>
        </router-link>

      <!-- </mt-loadmore> -->

    </div>
    
    
  </div>
</template>

<script>
import { bodyHeight } from '@/assets/public/function'
import pageHead from '@/components/head'
export default {
  name: 'classifydetail',
  data (){
    return {
      imgPre:this.$api.imgPre,
      title:'暂无分类',                               // 标题
      id:this.$route.params.id,                       // 分类id
      subCategories:[],                               // 下级分类
      goodsList:[],                                   // 商品信息
      selectSign:-1,                                  // 是否选中标记
      // allLoaded:false,

      pagetotal:5,                                    // 总页数
      currPage:1,                                     // 当前页
      
      bottomLoaded:false,                             // 是否允许加载
      imgErr:'this.src="/static/images/imgtem.png"',
      classArr:[]                                     // 分类数组 记录上一级操作
    }
  },
  components: {
   pageHead
  },
  created(){
    // console.log(this.$store.state.classArr)
    if(this.$store.state.classArr.length != 0){

      this.classArr = this.$store.state.classArr;

      const Numtem = this.$store.state.classArr.length - 1;
      this.id = this.$store.state.classArr[Numtem].id;
      // console.log(Numtem)
    }
    this.getId();
    
    this.getLevel();

    bodyHeight(100);

    this.$nextTick(function(){
      window.addEventListener('scroll', this.onScroll);
    })
  },

  destroyed(){
    bodyHeight();
    this.$store.commit('setClassArr',this.classArr)
  },
  methods:{
    // 获取id
    getId(){
      this.id = this.$route.params.id;
    },
    onScroll(){
      //获取body高度
      var a = document.documentElement.scrollTop==0? document.body.clientHeight : document.documentElement.clientHeight;
      //当前scroll值
      var b = document.documentElement.scrollTop==0? document.body.scrollTop : document.documentElement.scrollTop;
      //获取scroll的高度
      var c = document.documentElement.scrollTop==0? document.body.scrollHeight : document.documentElement.scrollHeight;

      if(b+a > c-50){
        this.currPage++;
        // console.log(this.currPage+' '+this.pagetotal)
        if(this.currPage <= this.pagetotal){
          // console.log('加载')
          this.getLevel();
          return false;
        }else{
          return false;
        }
      }

    },
    // 获取分类信息
    getLevel(){
      
      const _this = this;

      // 有默认选中
      _this.selectSign = _this.id;

      this.$axios({
        url:this.$api.search.searchcategory,
        params:{
          id:this.id,
          site_id:'',
          page: this.currPage
        }
      }).then(function(res) {

        let [data,Length] = [res.data.data,res.data.data.breadcrumb.length];
        // console.log(data)

        const temObj = {
          level:data.siblings[0].level,
          id:_this.id
        }

        if(Length == 1){

          _this.title = data.breadcrumb[0].name;
          _this.subCategories = data.sub_categories;
          // 一级分类 放置在数组第一位
          _this.classArr[0] = temObj;
          
        }else if(Length == 2){

          _this.title = data.breadcrumb[1].name;
          _this.subCategories = data.sub_categories; 
          // 二级分类 放置在数组第二位
          _this.classArr[1] = temObj;

        }else{

          _this.title = data.breadcrumb[1].name;
          _this.subCategories = data.siblings; 
          // 三级分类 放置在数组第一位（从分类页进入） 或 第三位（顺序点击进入）
          _this.classArr.length == 2 || _this.classArr.length == 3 
          ?_this.classArr[2] = temObj
          :_this.classArr[0] = temObj

        }

        // 分页
        _this.pagetotal = data.pagination.pagetotal;

        // 商品列表
        for(let i in data.goods_list){
          _this.goodsList.push(data.goods_list[i])
        }

        // _this.$refs.loadmore.onBottomLoaded();
        
      }).catch(function (error) {
        // _this.$toast('系统繁忙'); 
      });
    },

    // 返回上一页
    goBack(){
      this.goodsList = [];
      if(this.classArr.length ==1 &&this.classArr[0].level == 1){      // 首页进入

        this.$store.commit('setClassArr',[]);
        this.$router.push('/home');

      }else if(this.classArr.length ==1 &&this.classArr[0].level == 3){// 分类页进入（第三级分类）

        this.$store.commit('setClassArr',[]);
        this.$router.push('/classify');

      }else if(this.classArr.length ==2){                             // 在二级分类操作时 返回
        this.classArr.pop(); 
        this.id = this.classArr[0].id;
        this.getLevel();

      }else if(this.classArr.length ==3){                              // 在三级分类操作时 返回
        this.classArr.pop();
        this.id = this.classArr[1].id;
        this.getLevel();


      }
      

    },

    // 点击下级分类
    clickSub(value){
      // 点击三级分类 数组清空 从新请求数据
      this.goodsList = [];
      this.currPage = 1;
      this.id = value;
      this.getLevel();
      

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.classifydetail{
  height: 100%;
  background: #fff;
}
.classifydetail-header{
  height: .88rem;
  background: #fff;
  width: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999999;
}
.classifydetail-nav{
  position: fixed;
  z-index: 999999999;
  border-top: .01rem solid #eee;
  top: .88rem;
  height: .88rem;
  background: #fff;
  width: 100%; 
  &:before{
    content: '';
    position: absolute;
    width: 100%;
    height: .15rem;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 9999999999;
  }

  ul{
    height: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    li{
      display: inline-block;
      height: 100%;
      width: auto;
      text-align: center;
      a{
        display: inline-block;
        height: .5rem;
        padding: 0 .3rem;
        line-height: .5rem;
        margin: .2rem .1rem 0;
        font-size: .28rem;
      }
      .aActive{
        background: #009e4d;
        border-radius: .25rem;
        -moz-border-radius: .25rem;
        -webkit-border-radius: .25rem;
        color: #fff;
      }
    }
  }
}
.search-result{
 /* height: calc(100% - 2.45rem);
  height: -moz-calc(100% - 2.45rem);
  height: -webkit-calc(100% - 2.45rem);
  overflow: auto;*/
  background: #fff;
  ul{
    display: inline-block;
    width: 50%;
    text-align: center;
    /*border-bottom: .01rem solid #eee;
    border-right:.01rem solid transparent;*/
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    font-size: .26rem;
    padding: .2rem;
    /*&:nth-of-type(2n+1){
      border-right:.01rem solid #eee;
    }*/


    position: relative;
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
  .search-img{
    height: 3.6rem;
    img{
      width: 100%;
      height: auto;
      display: inline-block; 
    }
  }
  .search-title{
    width: 100%;
    padding: .1rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search-price{
    width: 100%;
    padding: .1rem 0;
    color: #EF614D;
    i{
      font-size: .26rem;
    }
  }
  .search-mark{
    width: 100%;
    padding: .1rem 0;
    color: #009e4d;
  }
}
.search-nosearch{
  padding: 3rem 0 .1rem;
  width: 100%;
  text-align: center;
  img{
    width: 30%;
    display: inline-block;
  }
  p{
    font-size: .3rem;
    margin-top: .3rem;
    color: #999;
  }
  a{
    margin-top: .3rem;
    display: inline-block;
    padding:.1rem .2rem;
    border: .01rem solid #009e4d;
    border-radius: .1rem;
    -moz-border-radius: .1rem;
    -webkit-border-radius: .1rem;
    color: #009e4d;
  }
}
.classify-alert{
  height: .68rem;
  background: #eee;
  position: fixed;
  z-index: 999999999;
  top: 1.76rem;
  width: 100%;
  text-align: center;
  line-height: .68rem;
  color: #999;
  font-size: .28rem;
}
/*.mint-loadmore{
  height: 100%;
}*/
</style>
