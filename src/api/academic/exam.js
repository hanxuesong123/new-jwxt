import axios from '@/libs/api.request.js'

const api = "teacher";

export const save = data =>{
  return axios.request({
    url:`${api}/exam/save`,
    method:'post',
    data:data
  });
};

export const update = data =>{
  return axios.request({
    url:`${api}/exam/update`,
    method:'put',
    data:data
  });
};

export const saveOrUpdate = data =>{
  return data.id ? update(data) : save(data);
};

export const list = data =>{
  return axios.request({
    url:`${api}/exam/list`,
    method:'post',
    data:data
  });
};

export const startExam = data =>{
  return axios.request({
    url:`${api}/exam/startExam/${data.id}`,
    method:'get',
    data:null
  });
};

export const showExam = data =>{
  return axios.request({
    url:`${api}/exam/showExam`,
    method:'post',
    data:data
  });
};

export const stopExam = data =>{
  return axios.request({
    url:`${api}/exam/stopExam`,
    method:'post',
    data:data
  });
};

export const readStudentAsks = data =>{
  return axios.request({
    url:`${api}/exam/readStudentAsks/${data}`,
    method:'get',
    data:null
  });
};

export const lastExam = data =>{  //给问答题评分
  return axios.request({
    url:`${api}/exam/lastExam`,
    method:'put',
    data:data
  });
};

export const endExam = data =>{
  return axios.request({
    url:`${api}/exam/endExam`,
    method:'post',
    data:data
  });
};

export const analysisExam = data =>{
  return axios.request({
    url:`${api}/exam/analysisExam`,
    method:'post',
    data:data
  });
};

export const showObjectExam = data =>{
  return axios.request({
    url:`${api}/exam/showObjectExam`,
    method:'post',
    data:data
  });
};

export const getQuestionExamTeacherList = data =>{
  return axios.request({
    url:`${api}/exam/getQuestionExamTeacherList`,
    method:'post',
    data:data
  });
};