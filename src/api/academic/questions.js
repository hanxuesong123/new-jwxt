import axios from '@/libs/api.request.js'

export const list = data => {
  return axios.request({
    url:'question/list',
    data:data,
    method:'post'
  });
}

export const save = data =>{
  return axios.request({
    url:'question/save',
    method:'post',
    data:data
  });
};

export const update = data =>{
  return axios.request({
    url:'question/update',
    method:'put',
    data:data
  });
}

export const downLoad = data =>{
  return axios.request({
    url:'question/downLoad',
    method:'post',
    data:data
  });
}



export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data)
}

export const opt = id =>{
  return axios.request({
    url:`question/opt/${id}`,
    method:'get',
    data:null
  });
}

export const count = data => {
  return axios.request({
    url:`question/count/${data}`,
    data:null,
    method:'get'
  });
}


