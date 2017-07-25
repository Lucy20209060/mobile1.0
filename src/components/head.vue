<template>
  <div class="head">
    <slot name="head-left"></slot>
    <slot name="head-center"></slot>
    <slot name="head-right"></slot>
  </div>
</template>

<script>
export default {
  name: 'head',
  data (){
    return {
      
    }
  },
  created(){
  
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.head{
  display: block;
  height: 100%;
  /*padding: 0 .3rem;*/
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
    border-top: 1px solid #eee;
    background: #eee;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 99999999999;
  }
  i{
    float: left;
    width: 1rem;
    height:100%;
    text-align: center;
    line-height: .88rem;
    font-size: .4rem;
  }
  span{
    float: left;
    width: calc(100% - 1rem*2);
    width: -moz-calc(100% - 1rem*2);
    width: -webkit-calc(100% - 1rem*2);
    height:100%;
    text-align: center;
    line-height: .88rem;
    img{
      display: inline-block;
      vertical-align: middle;
      width: 40%;
    }
    /*sub{
      font-size: .25rem;
    }*/
  }
}
</style>