import axios from '@/libs/api.request.js'

const api = "teacher";

export const findDepartments = () =>{
  return axios.request({
    url:`${api}/department/findDepartments`,
    data:null,
    method:'get'
  });
};
