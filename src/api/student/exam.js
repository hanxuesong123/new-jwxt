import axios from '@/libs/api.request.js'

export const getList = data =>{
    return axios.request({
        url:'student/exam/getList',
        method:'post',
        data:data
    });
};

export const getQuestionExamList = data =>{
    return axios.request({
        url:'student/exam/getQuestionExamList',
        method:'post',
        data:data
    });
};

export const getExamStatus = data =>{
    return axios.request({
        url:`student/exam/getExamStatus/${data}`,
        method:'get',
        data:null
    });
};


export const saveExam = data =>{
    return axios.request({
        url:'student/exam/saveExam',
        method:'post',
        data:data
    });
};
