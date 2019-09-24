
//验证 字符串大于30 必填
export const validate_text = (rule,value,callback) =>{
    if(!value){
       return callback(new Error("必填项"));
    }
    setTimeout(()=>{
        if(value.length > 30){
            callback(new Error("输入项不能大于30个字符"))
        }else{
            callback();
        }
    },500);
};

// 验证字符串大于2000 必填
export const validate_long_text = (rule,value,callback) =>{
    if(!value){
       return callback(new Error("必填项"));
    }
    setTimeout(()=>{
        if(value.length > 2000){
            callback(new Error("输入项不能大于2000个字符"))
        }else{
            callback();
        }
    },500)
};

//验证 多选框
export const validate_checkbox = (rule,value,callback) =>{
    if(!value){
        return callback(new Error("必填项"));
    }

    setTimeout(()=>{
        if(value.length < 2){
            callback(new Error("必须选择2个或2个以上的选项"));
        }else{
            callback();
        }
    },500);
};

//只能输入中文
export const only_chinese = (rule,value,callback) =>{
  if(!value){
      return callback(new Error("输入不可为空"));
  }
  setTimeout(()=>{
      const rep = /^[\u4e00-\u9fa5]+$/;
      if(!rep.test(value)){
          return callback(new Error("请输入中文"));
      }else{
          callback();
      }
  },500)
};

//验证手机号
export const validate_telephone = (rule,value,callback) =>{
    if(!value){
        return callback(new Error("输入不可为空"));
    }

    setTimeout(()=>{
        const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
        if(!reg.test(value)){
            return callback(new Error("请输入正确的手机号"));
        }else{
            callback();
        }
    },500);
};

//验证邮箱
export const validate_email = (rule,value,callback)=>{
    if(!value){
        return callback(new Error("输入不可为空"));
    }
    setTimeout(()=>{
        const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
        if(!reg.test(value)){
            return callback(new Error("请输入正确的email"));
        }else{
            callback();
        }
    },500);
};

//验证身份证
export const validate_id_card = (rule,value,callback) =>{
    if(!value){
        return callback(new Error("输入不可为空"));
    }
    setTimeout(()=>{
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!reg.test(value)){
            return callback(new Error("请输入正确的身份证号码"));
        }else{
            callback();
        }
    },500);
};

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
    }, 500);
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
    }, 500);
}