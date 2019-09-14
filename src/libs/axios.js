import axios from 'axios'
import store from  '@/store'
import iView from 'iview'
import config from '@/config';

import { getToken } from '@/utils/tools';

const baseURL = process.env.NODE_ENV !== 'production' ? config.baseUrl.dev : config.baseUrl.pro;
class HttpRequest {
  constructor(baseUrl = baseURL){
    this.baseUrl = baseUrl;
    this.queue = {};
  }


  //配置config
  getInSideConfig(){
    const config = {
      baseURL:this.baseUrl,
      params:{ //请求时,携带的额外参数
        "token": getToken()
      },
      timeout:20000,
      /*headers:{
        token:getToken()
      }*/
    };
    return config;
  }

  //配置拦截
  interceptors(instance,url){ //instance是axios的实例, url是请求的地址
    //请求拦截
    instance.interceptors.request.use(config=>{
          if(!Object.keys(this.queue).length){
            //添加全局的loading
          }
          this.queue[url] = true; // 标记: 确认
          return config;
        },
        error=>{
          return Promise.reject("请求前出现错误,错误是:"+error);
        });

    //响应拦截
    instance.interceptors.response.use(res=>{
          delete this.queue[url];
          return res;
        },
        error=>{
          delete this.queue[url];
          return Promise.reject("请求后出现错误,错误是:"+error);
        });
  }

  //实例化axios
  request(options){
    const instance = axios.create();
    options = Object.assign(this.getInSideConfig(),options);//合并配置
    this.interceptors(instance,options.url);
    return instance(options);
  }
}

export default HttpRequest;
