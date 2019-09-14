import axios from '@/libs/api.request.js'

export const getTeacherList = data => {
  return axios.request({
    url:'user/getTeacherList',
    data:data,
    method:'post'
  });
};

export const saveTeacher = data =>{
  return axios.request({
    url:'user/saveTeacher',
    data:data,
    method:'post'
  });
};

export const updateTeacher = data =>{
  return axios.request({
    url:'user/updateTeacher',
    data:data,
    method:'put'
  });
};

export const saveOrUpdate = data => {
  return data.id ? updateTeacher(data) : saveTeacher(data);
};
