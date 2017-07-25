<template>
  <div class="search">

    <header class="search-header">
      <pageHead>
        <i slot="head-left" class="iconfont icon-fanhui" @click="goBack"></i>
        <span slot="head-center">
          <label class="iconfont icon-sousuo"></label>
          <!-- ref="searchinput"  -->
          <input 
            class="search-header-input" 
            maxlength="15" 
            @keydown.enter="searchBtn"
            v-model="searchKeywords" 
            type="search" 
            @focus="inputFocus"
            v-focus
            placeholder="搜索供应链商品" />
        </span>
        <i slot="head-right" class="iconfont1"  @click="searchBtn">搜索</i>
      </pageHead>
    </header>

    <div style="height:.95rem;background:#eee;"></div>

    <section class="search-center">
      
      <dl class="search-notes" v-if="historySeach">
        <dt>
          <span>历史记录</span>
          <i class="iconfont icon-shanchu" @click="delHistory"></i>
        </dt>
        <dd>
          <a href="javascript:;" v-for="(item,index) in historyWords" key="index" @click="tapWords(item)">{{item}}</a>
        </dd>
      </dl>

      
      <div class="search-result" v-if="!historySign">
        
        <!-- 没有搜索结果 -->
        <div class="search-nosearch" v-if="noSearch">
          <img src="/static/images/kongb.png">
          <p>暂无搜索结果</p>
          <a href="javascript:;" @click="changeWords">换个词试试</a>
        </div>
        
        <!-- 搜索商品列表 -->
        <router-link v-for="(item,index) in goodsData" tag="ul" :to="{name:'detail',params:{id:item.goods_id}}" key="index">         
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

      </div>

    </section>

  </div>
</template>

<script>
import pageHead from '@/components/head'
import { bodyHeight } from '@/assets/public/function'
import { getCookie,setCookie,delCookie } from '@/assets/public/cookie'
export default {
  name: 'search',
  data (){
    return {
      imgPre:this.$api.imgPre,
      searchKeywords:'',        // 输入框关键字
      historyWords:[],          // 历史记录数组
      historySign:false,         // 是否显示历史搜索记录HTML标签
      goodsData:[],             // 搜索api回调数据
      noSearch:false,           // 是否显示 暂无搜索结果
      historySeach:false,
      imgErr:'this.src="/static/images/imgtem.png"'
    }
  },
  components: {
   pageHead
  },
  created(){
    this.getHistoryWords();
  },
  mounted(){
    bodyHeight(100);

  },
  destroyed(){
    bodyHeight();
    document.activeElement.blur();
  },
  directives:{
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  methods:{

    // 搜索按钮
    searchBtn(){
      const _this = this;
      document.activeElement.blur();

      if(this.searchKeywords == ''){
        return false;
      }
      this.historySign = false;
      this.$axios({
          url:this.$api.search.searchcategory,
          params:{
            q:this.searchKeywords,
            id:'',
            site_id:'',
            page: 1
          }
      }).then(function(res) {

        _this.goodsData = res.data.data.goods_list;

        if(_this.goodsData.length == 0){
          _this.noSearch = true;
        }else{
          _this.noSearch = false;
        }

      }).catch(function (error) {
        // _this.$toast('系统繁忙'); 
      });

      // 记录搜索记录 删除与搜索关键字相同的历史关键字
      for(let i in this.historyWords){
        if(this.searchKeywords == this.historyWords[i]){
          this.historyWords.splice(i,1);
        }
      }
      // 搜索关键字推入数组中 保留前7条数据
      this.historyWords.unshift(this.searchKeywords);
      this.historyWords = this.historyWords.slice(0,6);

      // 历史记录转化为字符串 存储在cookie中 有效期30天
      const strHistory = JSON.stringify(this.historyWords);
      setCookie('007bd29c877386a39ed79dbe0e8907c9',strHistory,'d30');

      // 清空输入框
      this.searchKeywords = '';

      // 获取cookie
      // this.getHistoryWords();

      this.historySeach = false;

    },

    // 返回上一页
    goBack(){
      this.$router.go(-1);
    },

    // 获取搜索历史记录
    getHistoryWords(){
      const strHistoryWords = getCookie('007bd29c877386a39ed79dbe0e8907c9');
      // console.log(JSON.parse(strHistoryWords))
      if(strHistoryWords != null){
        this.historySeach = true;
        this.historyWords = JSON.parse(strHistoryWords);
        // console.log(this.historyWords)
      }else{
        this.historyWords = [];
        this.historySign = false;
        this.historySeach = false;
      }
    },

    // 删除历史记录
    delHistory(){
      delCookie('007bd29c877386a39ed79dbe0e8907c9');
      this.getHistoryWords();
      this.goodsData = [];
      this.noSearch = false;

    },

    // 输入框获取焦点
    inputFocus(){
      // console.log(1111)
      this.historySign = true;
      this.getHistoryWords();
    },

    // 点击历史记录中的关键字
    tapWords(value){
      this.searchKeywords = value;
      this.searchBtn();
    },
    changeWords(){
      this.$refs.searchinput.focus();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search-notes{
  padding: 0 .3rem;
  dt{
    padding: .34rem 0;
    overflow: hidden;
    line-height: .5rem;
    span{
      float: left;
    }
    i{
      float: right;
    }
  }
  dd{
    overflow: hidden;
    a{
      border: .01rem solid #eee;
      min-width: .8rem;
      text-align: center;
      padding: 0 .2rem;
      float: left;
      height: .5rem;
      line-height: .5rem;
      margin: 0 .24rem .24rem 0;
      border-radius: .25rem;
      -moz-border-radius: .25rem;
      -webkit-border-radius: .25rem;
      font-size: .28rem;
    }
  }
}
.search{
  height: 100%;
}
footer{
  height: .88rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.search-header{
  height: .88rem;
  position: fixed;
  background: #fff;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.head .iconfont1{
  width: 1rem;
  color: #333;
  font-size: .3rem;
  text-align: center;
}
.head span {
  position: relative;
  z-index: 999;
    width: calc(100% - 2rem);
    width: -webkit-calc(100% - 2rem);
    height: 100%;
    line-height: .88rem;
    label{
      position: absolute;
      left: .2rem;
      line-height: .88rem;
    }
    input{
      float: left;
      margin-top: .16rem;
    }
  }
.search-header-input{
  border: 0;
  height: .56rem;
  background: #eee;
  width: 100%;
  padding: 0 .3rem 0 .7rem;
  border-radius: .4rem;
  -moz-border-radius: .4rem;
  -webkit-border-radius: .4rem;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  font-size: .28rem;
}
.search-center{
  background: #fff;
  height: calc(100% - .95rem);
}
.search-result{
  overflow: hidden;
  background: #fff;
  ul{
    float: left;
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
  padding: 2rem 0 .1rem;
  width: 100%;
  text-align: center;
  img{
    width: 30%;
    display: inline-block;
  }
  p{
    font-size: .3rem;
    margin-top: .3rem;
    color:#999;
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
</style>