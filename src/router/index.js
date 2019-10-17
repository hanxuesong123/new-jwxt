import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import iView from 'iview';
import config from '@/config';

import { setToken,getToken } from '@/utils/tools';

const { homeName } = config;

Vue.use(Router);

const router = new Router({
  routes,
  mode:'history'
});


/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access);
  else return true;
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return hasAccess(access, item);
      }
    });
  };

  return routePermissionJudge(routes);
};

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next(); // 有权限，可访问
  else next({ replace: true, name: 'error_401' }); // 无权限，重定向到401页面
};

router.beforeEach((to,from,next)=>{
  const token = getToken();
  if(!token && to.name !== 'login'){ //未登录且要跳转的页面不是登录页
    next({name:'login'}); //强制跳转到登录页
  } else if (!token && to.name === 'login'){ //未登录且要跳转的页面是登录页
    next();//放行
  } else if (token && to.name === 'login'){ //已登录且要跳转的页面是登录页
    next({name:'question'});
  } else { //要登录
    if(store.state.user.access){ //有权限
      turnTo(to,store.state.user.access.roles,next);
    }else{//无权限 去后台查询
      store.dispatch('getUserInfo').then(user=>{
        //拉取用户信息,通过用户权限和跳转的页面的name来判断是否有权访问,access必须是一个数组
        //如：['super_admin'] ['super_admin', 'admin']
        //turnTo(to,user.data.data,next);
        refresh(to,store.state.user.access,next,from);
      }).catch(()=>{
        setToken('');
        next({name:'login'});
      });
    }
  }
});

export const refresh=(to, access, next,from)=>{
  let toName=to.name;
  // console.log('要去的路由',to.name);
  // console.log('权限路由列表',access.roles.menus);
  let arr=access.roles.menus;
  arr.forEach(item=>{
    if(item==toName){
      next({replace: true, name:toName});
    }
  });
  if(toName =="home"){
    next({replace: true, name:toName});
  }
};



export default router;
