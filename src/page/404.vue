<template>
    <div class="nopage">
        <img src="/static/images/404.png" />
        <p>
            <router-link to="/home">首页</router-link>
            <a href="javascript:;" @click="goBack">返回上一页</a>
        </p>
    </div>
</template>

<script>
import { bodyHeight } from '@/assets/public/function'
export default {
    name: 'nopage',
    data (){
        return {
          
        }
    },
    created(){
      
    },
    mounted(){
        bodyHeight(100);
    },
    destroyed(){
        bodyHeight();
    },
    methods:{
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.nopage{
    height: 100%;
    background: #fff;
    text-align: center;
    img{
        display: inline-block;
        width: 70%;
        height: auto;
        margin-top: 30%;
    }
    p{
        padding-top: .8rem;
    a{
        display: inline-block;
        background: #fff;
        border: .01rem solid #009e4d;
        padding: 0 .3rem;
        height: .6rem;
        line-height: .6rem;
        border-radius: .08rem;
        color: #009e4d;
        font-size: .3rem;
        &:nth-of-type(1){
            margin-right:.3rem;
        }
    }
    }
}
</style>

