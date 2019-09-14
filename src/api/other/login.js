import axios from '@/libs/api.request.js'

export const login = data => {
  return axios.request({
    url:'login',
    data:data,
    method:'post'
  });
};

export const getUserInfo  = () =>{
  return axios.request({
    url:'profile',
    data:null,
    method:'get'
  });
};
