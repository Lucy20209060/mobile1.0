<template>
    <div class="index">

      <keep-alive>
        <router-view v-if="this.$route.name != 'shopCart'"></router-view>
      </keep-alive>

      <router-view v-if="this.$route.name == 'shopCart'"></router-view>
    
    <!-- <div style="height:.9rem;width:100%;"></div> -->

    <div class="footer">
        <footerNav></footerNav>
    </div>

  </div>
</template>

<script>
import footerNav from '@/components/footerNav'
export default {
    name: 'index',
    data (){
        return {

        }
    },
    components: { footerNav },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.footer{
  height: .98rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index:9999999;
}
.index{
  height:calc(100% - .98rem);
  height: -moz-calc(100% - .98rem);
  height: -webkit-calc(100% - .98rem);
}
</style>
