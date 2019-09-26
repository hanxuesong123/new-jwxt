import axios from '@/libs/api.request.js'

const api = "teacher";

export const findGeneralByCode = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/findGeneralByCode`,
    method:'post'
  });
};

export const findChapterByCodeAndStage = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/findChapterByCodeAndStage`,
    method:'post'
  });
};

export const  list = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/list`,
    method:"post"
  });
};


export const  save = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/save`,
    method:"post"
  });
};

export const  update = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/update`,
    method:"put"
  });
};

export const saveOrUpdate = (data) =>{
  return data.id ? update(data) : save(data)
};

export const opt = data =>{
  return axios.request({
    data:data,
    url:`${api}/general/opt`,
    method:'post'
  });
};

export const findGenerals = () => {
  return axios.request({
    data:null,
    url:`${api}/general/findGenerals`,
    method:'get'
  });
};
