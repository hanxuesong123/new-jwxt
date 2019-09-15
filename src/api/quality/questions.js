import axios from '@/libs/api.request.js'

export const list = data => {
  return axios.request({
    url:'question/list',
    data:data,
    method:'post'
  });
}
