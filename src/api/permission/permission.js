import axios from '@/libs/api.request.js'

export const getPermissionList = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:'permission/list'
  });
};

export const getPermissions = () =>{
  return axios.request({
    method:'get',
    data:null,
    url:'permission/getPermissions'
  });
}

export const load = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:'permission/load'
  });
};

export const save = data =>{
  return axios.request({
    method:'post',
    data:data,
    url:'permission/save'
  });
};

export const update = data =>{
  return axios.request({
    method:'put',
    data:data,
    url:'permission/update'
  });
};

export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data);
};

export const getPermissionsByRoleId = id => {
  return axios.request({
    method:'get',
    data:null,
    url:`permission/getPermissionsByRoleId/${id}`
  });
}
