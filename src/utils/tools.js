import Cookies from 'js-cookie';
import config from '@/config'

const { cookieExpires } = config;

export const TOKEN_KEY = "token"; //这个是cookie的key


export const formatDate = date => {
  date = new Date(date);
  var strDate = date.getFullYear()+"-";
  strDate += date.getMonth()+1+"-";
  strDate += date.getDate()+"-";
  strDate += date.getHours()+":";
  strDate += date.getMinutes()+":";
  strDate += date.getSeconds() +"-";
  let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  strDate += week[date.getDay()];
  return strDate ;
};

export const getDay = date => {
  return date.getDay();
};

export const formatTime = date => {
  date = new Date(date);
  var strDate = date.getFullYear()+"-";
  strDate += date.getMonth()+1+"-";
  strDate += date.getDate()+"-";
  let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  strDate += week[date.getDay()];
  return strDate ;
};

export const getDays = date => {

  //获取年份
  let year = date.getFullYear();

  //获取当前月份
  let mouth = date.getMonth() + 1;
  //定义当月的天数；
  let days;

  //当月份为二月时，根据闰年还是非闰年判断天数
  if (mouth == 2) {
    days = year % 4 == 0 ? 29 : 28;

  } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
    //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
    days = 31;
  } else {
    //其他月份，天数为：30.
    days = 30;

  }
  return days;
};



export const setToken = token => {
  Cookies.set(TOKEN_KEY,token,{ expires:cookieExpires || 1 });
};

export const getToken = () => {
  let token = Cookies.get(TOKEN_KEY);
  if(token){
    token = "Bearer " + token;
    return token;
  }
  else return null;
};

export const handleArrayDataUtil = (srcArr,descArr,totalArr) =>{ //工具类：生成子类数据列表
  srcArr.forEach(parent=>{
    totalArr.forEach(root=>{
      if(parent.id == root.pid){
        descArr.push(root);
      }
    });
  });
};
export const handleParentDataUtil = (srcArr,descArr) =>{ //工具类： 生成顶级菜单列表
  srcArr.forEach(item=>{
    if(item.pid == '0' && item.type == 1){
      descArr.push(item);
    }
  });
};

export const handleQueryDataUtil = (queryName,srcArr) =>{  //工具类： 处理查询数据
  let arr = [];
  srcArr.forEach(item => {
    if (item.name.includes(queryName)) {
      arr.push(item);
    }
  });
  return arr;
};


export const splice = arr => {
  for(let i = 0 ; i < arr.length ; i ++){
    if(arr[i] == "5"){
      arr.splice(i,1);
    }
  }
  return arr;
};