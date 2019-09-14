import axios from '@/libs/api.request.js'

export const findDepartments = () =>{
  return axios.request({
    url:'department/findDepartments',
    data:null,
    method:'get'
  });
};
