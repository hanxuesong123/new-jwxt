import axios from '@/libs/api.request.js'

const api = "student";

export const getStages = () =>{
    return axios.request({
        method:'get',
        data:null,
        url:`${api}/exercise/getStages`
    });
};

export const getChapters = id =>{
    return axios.request({
        method:'get',
        data:null,
        url:`${api}/exercise/getChapters/${id}`
    });
};

export const getRandomQuestionByChapter = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`${api}/exercise/getRandomQuestionByChapter`
    });
};

export const saveQuestionToCache = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`${api}/exercise/saveQuestionToCache`
    });
};

export const saveErrorQuestion = data =>{
    return axios.request({
        method:'post',
        data:data,
        url:`${api}/exercise/saveErrorQuestion`
    });
};