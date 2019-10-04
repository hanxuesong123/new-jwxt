import axios from '@/libs/api.request.js'

const api = "teacher";

export const getDayExamList = data =>{
    return axios.request({
        method:'post',
        url:`${api}/supervise/getDayExamList`,
        data:data
    });
};