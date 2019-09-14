import axios from '@/libs/api.request.js'

export const findGeneralByCode = data =>{
  return axios.request({
    data:data,
    url:'general/findGeneralByCode',
    method:'post'
  });
};
