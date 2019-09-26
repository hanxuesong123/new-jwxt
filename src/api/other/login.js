import axios from '@/libs/api.request.js'

const api = "teacher";

export const login = data => {
  return axios.request({
    url:`${api}/login`,
    data:data,
    method:'post'
  });
};

export const getUserInfo  = () =>{
  return axios.request({
    url:`${api}/profile`,
    data:null,
    method:'get'
  });
};
