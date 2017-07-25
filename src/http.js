import axios from 'axios'

axios.defaults.timeout = 5000;
// axios.defaults.headers['Authorization'] = '2378462354';
// axios.defaults.baseURL = 'http://localhost:8086';

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{

    if(res.status != 200){
        return Promise.reject(res);
    }else{
    	// 请求成功
    }
    return res;

}, (error) => {

    return Promise.reject(error);
});



export default axios;