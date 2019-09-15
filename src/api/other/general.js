import axios from '@/libs/api.request.js'

export const findGeneralByCode = data =>{
  return axios.request({
    data:data,
    url:'general/findGeneralByCode',
    method:'post'
  });
};

export const findChapterByCodeAndStage = data =>{
  return axios.request({
    data:data,
    url:'general/findChapterByCodeAndStage',
    method:'post'
  });
};

export const  list = data =>{
  return axios.request({
    data:data,
    url:'general/list',
    method:"post"
  });
};


export const  save = data =>{
  return axios.request({
    data:data,
    url:'general/save',
    method:"post"
  });
};

export const  update = data =>{
  return axios.request({
    data:data,
    url:'general/update',
    method:"put"
  });
};

export const saveOrUpdate = (data) =>{
  return data.id ? update(data) : save(data)
};

export const opt = data =>{
  return axios.request({
    data:data,
    url:`general/opt`,
    method:'post'
  });
};
