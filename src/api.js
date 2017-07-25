const apiPre = process.env.NODE_ENV === 'production' 
                ? '/api.php' 
                : '/dev.api.php'

const imgPrefix = process.env.NODE_ENV === 'production' 
                ? '' 
                : 'http://dev.anchumall.cc:9999'

const Api = {

    // 图片前缀 开发中使用
    imgPre: imgPrefix,

    // 页面 api
    login:{
        login:`${apiPre}?s=api/User/do_login`,
        is_login:`${apiPre}?s=api/User/is_login`,
        user_is_verify:`${apiPre}?s=api/User/user_is_verify`,
        getUserInfo:`${apiPre}?s=api/user/getUserInfo`
    },
    home:{
        getSite:`${apiPre}?s=api/site/getlist`,
        banner:`${apiPre}?s=api/index/bannerlist`,
        getlevel1:`${apiPre}?s=api/category/getlevel1`,
        category_products:`${apiPre}?s=api/index/category_products`
    },
    detail:{
        detail:`${apiPre}?s=api/goods/info`,
        cartAdd:`${apiPre}?s=api/cart/add`,
        cartNum:`${apiPre}?s=api/cart/cartnum`
    },
    mine:{
        logout:`${apiPre}?s=api/User/logout`
    },
    search:{
        searchcategory:`${apiPre}?s=api/goods/searchcategory`,
    },
    classify:{
        getlevel1children:`${apiPre}?s=api/category/getlevel1children`,
    },
    classifyDetail:{

    },
    shopCart:{
        getGoodsList:`${apiPre}?s=api/cart/getlist`,
        updateHttp:`${apiPre}?s=api/cart/update`,
        removeHttp:`${apiPre}?s=api/cart/remove`

    }

}

export default Api;