import axios from '@/libs/api.request.js'
export const save = data =>{
  return axios.request({
    url:'exam/save',
    method:'post',
    data:data
  });
};

export const update = data =>{
  return axios.request({
    url:'exam/update',
    method:'put',
    data:data
  });
};

export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data);
};

export const list = data =>{
  return axios.request({
    url:'exam/list',
    method:'post',
    data:data
  });
}

export const startExam = data =>{
  return axios.request({
    url:`exam/startExam/${data.id}`,
    method:'get',
    data:null
  });
};

export const showExam = data =>{
  return axios.request({
    url:`exam/showExam`,
    method:'post',
    data:data
  });
};
