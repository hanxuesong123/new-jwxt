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

export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data)
}
