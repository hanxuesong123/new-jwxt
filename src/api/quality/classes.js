import axios from '@/libs/api.request.js'

export const getClassesList = data => {
  return axios.request({
    url:'classes/getClassesList',
    data:data,
    method:'post'
  });
};

export const findClasses = () => {
  return axios.request({
    url:'classes/findClasses',
    data:null,
    method:'get'
  });
};

export const saveClasses = data => {
  return axios.request({
    url:'classes/saveClasses',
    data:data,
    method:'post'
  });
};

export const updateClasses = data => {
  return axios.request({
    url:'classes/updateClasses',
    data:data,
    method:'put'
  });
};


export const saveOrUpdate = data => {
  return data.id ? updateClasses(data) : saveClasses(data);
};
