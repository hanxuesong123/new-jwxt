import axios from '@/libs/api.request.js'

export const list = data =>{
    return axios.request({
        url:'teacher/student/list',
        method:'post',
        data:data
    });
};


export const save = data =>{
    return axios.request({
        url:'teacher/student/save',
        method:'post',
        data:data
    });
};

export const update = data =>{
    return axios.request({
        url:'teacher/student/update',
        method:'put',
        data:data
    });
};

export const saveOrUpdate = data =>{
    return data.id ? update(data) : save(data);
};

export const accessClasses = data =>{
    return axios.request({
        url:'teacher/student/accessClasses',
        method:'post',
        data:data
    });
}