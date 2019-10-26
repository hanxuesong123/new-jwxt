import axios from '@/libs/api.request.js'

const api = "teacher";

export const getTeacherList = data => {
  return axios.request({
    url:`${api}/user/getTeacherList`,
    data:data,
    method:'post'
  });
};

export const saveTeacher = data =>{
  return axios.request({
    url:`${api}/user/saveTeacher`,
    data:data,
    method:'post'
  });
};

export const updateTeacher = data =>{
  return axios.request({
    url:`${api}/user/updateTeacher`,
    data:data,
    method:'put'
  });
};

export const saveOrUpdate = data => {
  return data.id ? updateTeacher(data) : saveTeacher(data);
};

export const findTeachers = () =>{
  return axios.request({
    url:`${api}/user/findTeachers`,
    data:null,
    method:'get'
  });
};

export const updatePassword = data =>{
  return axios.request({
    url:`${api}/user/updatePassword`,
    data:data,
    method:'put'
  });
};

export const checkTelephone = data =>{
  return axios.request({
    url:`${api}/user/checkTelephone`,
    data:data,
    method:'post'
  });
};
export const sendCode = data =>{
  return axios.request({
    url:`${api}/user/sendCode`,
    data:data,
    method:'post'
  });
};

export const updatePasswordByCode = data =>{
  return axios.request({
    url:`${api}/user/updatePasswordByCode`,
    data:data,
    method:'post'
  });
};