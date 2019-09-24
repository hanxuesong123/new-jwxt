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

export const getScoreStatus = data =>{
    return axios.request({
        url:`student/exam/getScoreStatus/${data}`,
        method:'get',
        data:null
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


export const goBackStudentExamData = data =>{
    return axios.request({
        url:'student/exam/goBackStudentExamData',
        method:'post',
        data:data
    });
};