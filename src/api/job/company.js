import axios from '@/libs/api.request.js'

export const findCompanys = () => {
  return axios.request({
    url:'company/findCompanys',
    data:null,
    method:'get'
  });
}
