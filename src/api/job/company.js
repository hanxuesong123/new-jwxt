import axios from '@/libs/api.request.js'

const api = "teacher";

export const findCompanys = () => {
  return axios.request({
    url:`${api}/company/findCompanys`,
    data:null,
    method:'get'
  });
}
