<template>
  <div class="classify">

    <header class="search-header">
      <span>
        <label class="iconfont icon-sousuo"></label>
        <input @focus="inputFocus" class="search-header-input" type="text" placeholder="搜索供应链商品" />
      </span>
    </header>

    <!-- <div style="height:.95rem;background:#eee;"></div> -->
    
    <!-- 左侧 一级分类 -->
    <ul class="classify-nav">
      <li v-for="(item,index) in level1" key="index">
        <a href="javascript:;" 
          @click="selectSite(item.id)" 
          v-text="item.name" 
          :class="{aActive:selectId == item.id}">一级分类名称
        </a>
      </li>
    </ul>
    
    <!-- 右侧 二三级分类 列表 -->
    <section class="classify-center" :style="{minHeight:clientHeight+'px'}">

      <dl v-for="(item,index) in level1children" key="index">

        <dt v-text="item.name">二级分类标题</dt>

        <router-link 
          tag="dd" 
          v-for="(items,index) in item.children" key="index"
          :to="{name:'classifyDetail',params:{id:items.id}}"  
        >
          <P><img :src="imgPre + items.image" :onerror="imgErr" /></P>
          <i v-text="items.name"></i>
        </router-link>

      </dl>

    </section>

  </div>
</template>

<script>
export default {
  name: 'classify',
  data (){
    return {
      imgPre:this.$api.imgPre,
      selectId:'',
      level1:[],
      level1children:[],
      imgErr:'this.src="/static/images/kongb.png"',
      clientHeight:document.documentElement.clientHeight    // 屏幕高度
    }
  },
  created(){
    this.getLevel1();
    // 清除分类详情页 分类级别信息
    this.$store.commit('setClassArr',[]);
  },
  mounted(){
    document.activeElement.blur();
  },
  methods:{
    // 获取焦点时跳转到搜索页
    inputFocus(){
      this.$router.push('/search');
    },

    // 返回上一页
    goBack(){
      this.$router.go(-1);
    },

    // 获取一级分类
    getLevel1(){
      const _this = this;
      this.$axios({
          url:this.$api.home.getlevel1
      }).then(function(res) {

        for(const i in res.data.data){
          if(res.data.data[i].level == 1){
            
            _this.level1.push(res.data.data[i]);

          }
        }
        _this.selectId = res.data.data[1].id;
        _this.getlevel1children();
        // console.log(res.data.data)

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    },

    // 获取二三级分类
    getlevel1children(){
      const _this = this;
      this.$axios({
          url:this.$api.classify.getlevel1children,
          params:{
            id:this.selectId
          }
      }).then(function(res) {

        _this.level1children = res.data.data;

      }).catch(function (error) {
        // _this.$toast(error.msg);   
      });
    },

    // 点击选择一级分类
    selectSite(value){
      this.selectId = value;
      this.getlevel1children();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.classify{  
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
  text-align: center;
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
    z-index: 99999;
  }
}
.classify header span {
  display: inline-block;
  position: relative;
  z-index: 999;
  width: calc(100% - .6rem);
  width: -webkit-calc(100% - .6rem);
  width: -moz-calc(100% - .6rem);
  height: 100%;
  line-height: .88rem;
  label{
    position: absolute;
    left: 2rem;
    line-height: .88rem;
    color: #999;
  }
  input{
    float: left;
    margin-top: .16rem;
  }
}
.search-header-input{
  border: 0;
  height: .56rem;
  line-height: .56rem;
  background: #eee;
  width: 100%;
  /*padding: 0 .3rem 0 .7rem;*/
  border-radius: .4rem;
  -moz-border-radius: .4rem;
  -webkit-border-radius: .4rem;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  font-size: .28rem;
  text-align: center;
}
.classify-nav{
  position: fixed;
  top:.88rem;
  width: 2rem;
  bottom: .88rem;
  background: #eee;
  padding-top: 5px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  li{
    padding: .2rem 0;
    text-align: center;
    
    a{
      display: inline-block;
      width: 1.5rem;
      height: .48rem;
      line-height: .48rem;
      -moz-border-radius: .24rem;
      -webkit-border-radius: .24rem;
      border-radius: .24rem;
      font-size: .26rem;
    }
    .aActive{
      background: #009e4d;
      color: #fff;
    }
  }
}
.classify-center{
  background: #fff;
  /*position: fixed;
  right: 0;
  top: .88rem;
  bottom: .88rem;
  left: 2rem;
  overflow-y: scroll;*/
  /*-webkit-overflow-scrolling: touch;*/
  padding: .88rem 0 .98rem 2rem;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  dl{
    width: 100%;
    padding: .3rem .4rem .2rem;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    font-size: .3rem;
    dd{
      display: inline-block;
      width: 33%;
      text-align: center;
      margin-top: .3rem;
      p{
        img{
          display: inline-block;
          width: 70%;
          height: auto;
        }
      }
      i{
        color: #999;
        font-size: .24rem;
      }
    }
  }
}
</style>