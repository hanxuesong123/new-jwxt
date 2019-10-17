import {login,getUserInfo} from '@/api/other/login';
import { getToken,setToken } from '@/utils/tools';

const state= {
  token: getToken(),
  access:''
};

const mutations = {
  SET_TOKEN(state,token){
   state.token = token;
   setToken(token);
  },
  SET_ACCESS(state,access){
   state.access = access;
  },
  UN_SET_TOKEN(state,data){
      state.token = data;
      state.access = data;
  }
};

const actions = { //向外暴露的接口
  handleLogin({commit},{username,password}){ //登录
    return new Promise((resolve,reject)=>{
      login({username,password})
          .then(res=>{
            if(res.data.code == 10000){
              const token = res.data.data; //获取到token
              commit('SET_TOKEN',token); //通过mutations分别向cookie和state中设置token
              resolve();//执行
            }else{
                alert(res.data.message)
                return false;
            }
          })
          .catch(err=>{ //异常
            reject(err);
          });
    });
  },
  getUserInfo({state,commit}){ //获取用户相关信息
    return new Promise((reslove,reject)=>{
      try {
        getUserInfo(state.token)
            .then(res=>{
              const access = res.data.data;
              commit('SET_ACCESS',access);
              reslove(access);
            })
            .catch(err=>{
              reject(err);
            });
      }catch (error) {
        reject(error);
      }
    });
  },
  logout({commit}){
    commit('UN_SET_TOKEN',"");
  }
};


const getters = {};

export default {
    state,
    actions,
    getters,
    mutations
};

