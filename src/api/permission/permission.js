import axios from '@/libs/api.request.js'

const api = "teacher";


export const getPermissionList = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/permission/list`
  });
};

export const getPermissions = () =>{
  return axios.request({
    method:'get',
    data:null,
    url:`${api}/permission/getPermissions`
  });
}

export const load = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/permission/load`
  });
};

export const save = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/permission/save`
  });
};

export const update = data =>{
  return axios.request({
    method:'put',
    data:data,
    url:`${api}/permission/update`
  });
};

export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data);
};

export const getPermissionsByRoleId = id => {
  return axios.request({
    method:'get',
    data:null,
    url:`${api}/permission/getPermissionsByRoleId/${id}`
  });
};
