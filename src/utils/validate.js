/* 是否邮箱*/
export function isEmail(rule, value,callback) {
    const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if(value==''||value==undefined||value==null){
        callback(new Error("必输项"));
    }else{
        if (!reg.test(value)){
            callback(new Error('请输入正确的邮箱地址'));
        } else {
            callback();
        }
    }
}

/*验证内容是否英文数字以及下划线*/
export function is_English_Number_(rule, value, callback) {
    const reg =/^[_a-zA-Z0-9]+$/;
    if(value==''||value==undefined||value==null){
        callback(new Error("必输项"));
    } else {
        if (!reg.test(value)){
            callback(new Error('密码仅由英文字母，数字以及下划线组成'));
        } else {
            callback();
        }
    }
}

//验证数字输入框最大数值,32767
export function checkMaxVal(rule, value,callback) {
    if (value < 0 || value > 32767) {
        callback(new Error('请输入[0,32767]之间的数字'));
    } else {
        callback();
    }
}
//验证是否1-99之间
export function isOneToNinetyNine(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[1-9][0-9]{0,1}$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数，值为【1,99】'));
            } else {
                callback();
            }
        }
    }, 0);
}

// 验证是否整数
export function isInteger(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入正整数'));
        } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
                callback(new Error('请输入正整数'));
            } else {
                callback();
            }
        }
    }, 0);
}


export const isEmpty = (rule,value,callback) =>{
    if(!value){
        return callback(new Error("输入项不可为空"));
    }
};

export const length = (rule,value,callback) => {
    if(value.length < 4){
        return callback(new Error("不能小于3个字符"));
    }

    if(value.length > 16){
        return callback(new Error("不能大于16个字符"))
    }

};

export const checkbox = (rule,value,callback) =>{
    if(!value){
        return callback(new Error("不可为空"));
    }else{
        if(value.length == 0){
            return callback(new Error("至少选中一项"));
        }else{
            callback();
        }
    }
};

/* 是否手机号码*/
export function validatePhone(rule, value,callback) {
    const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码'));
        } else {
            callback();
        }
    }
}

/* 是否身份证号码*/
export function validateIdNo(rule, value,callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    }
}

// 验证是否是[0-100]的小数
export function isBtnZeroToHundred(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入[1,100]之间的数字'));
        } else {
            if (value < 0 || value > 100) {
                callback(new Error('请输入[1,100]之间的数字'));
            } else {
                callback();
            }
        }
    }, 100);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}