import axios from '@/libs/api.request.js'

const api = "teacher";


export const list = data => {
  return axios.request({
    url:`${api}/question/list`,
    data:data,
    method:'post'
  });
};

export const upperList = data => {
  return axios.request({
    url:`${api}/question/upperList`,
    data:data,
    method:'post'
  });
};

export const save = data =>{
  return axios.request({
    url:`${api}/question/save`,
    method:'post',
    data:data
  });
};

export const update = data =>{
  return axios.request({
    url:`${api}/question/update`,
    method:'put',
    data:data
  });
};

export const downLoad = data =>{
  return axios.request({
    url:`${api}/question/downLoad`,
    method:'post',
    data:data
  });
};



export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data)
};

export const opt = id =>{
  return axios.request({
    url:`${api}/question/opt/${id}`,
    method:'get',
    data:null
  });
};

export const count = data => {
  return axios.request({
    url:`${api}/question/count/${data}`,
    data:null,
    method:'get'
  });
};

