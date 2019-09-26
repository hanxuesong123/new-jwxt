import axios from '@/libs/api.request.js'


const api = "teacher";

export const list = data => { //分页查询
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/role/list`
  });
};

export const findRoles = () => {
  return axios.request({
    url:`${api}/role/findRoles`,
    data:null,
    method:'get'
  });
};



export const save = data => {
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/role/save`
  });
};

export const update = data => {
  return axios.request({
    method:'put',
    data:data,
    url:`${api}/role/update`
  });
};

export const saveOrUpdate = data => {
  return data.id ? update(data) : save(data)
};

export const accessPermission = data =>{ //保存角色权限关联的接口  data = {roleId:'',permissionIds:'xx,xxx,xxx'}
  return axios.request({
    method:'post',
    data:data,
    url:`${api}/role/accessPermission`
  });
};

export const getAssessPermissions = id => {  //查询已关联的角色权限接口  id = roleId
  return axios.request({
    url:`${api}/role/getAssessPermissions/${id}`,
    data:null,
    method:'get'
  });
};


export const assessRole = data =>{
  return axios.request({
    url:`${api}/role/assessRole`,
    data:data,
    method:'post'
  });
};

export const getAssessRoles = data =>{
  return axios.request({
    url:`${api}/role/getAssessRoles/${data}`,
    data:null,
    method:'get'
  });
};
