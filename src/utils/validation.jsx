// password should contain number & char
export function shouldContainLetters (rule, str, callback) {
  const trimedStr = str.trim()
  if(/^\d+$/.test(trimedStr)){
    callback('The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are recommended.')
  }
  callback()
}

export function shouldContainNumber (rule, str, callback) {
  const trimedStr = str.trim()
  if(/^[a-z]+$/i.test(trimedStr)){
    callback('The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are recommended.')
  }
  callback()
}

export function shouldNotHaveSpecialChar (rule, str, callback) {
  const trimedStr = str.trim()
  if(!/^[A-Za-z0-9]+$/.test(trimedStr)){
    callback('The password should contain at least 8 characters, at least one number and at least one letter. Upper case letter and special letter are not recommended.')
  }
  callback()
}

/**
 * 检测密码强度,必须由数字与字母组合,至少6位的字符串。
 */
// $.checkPwd = function(v){
//     v=$.trim(v);
//     if(v.length<6||v.length>30){
//        return "密码长度为6-30位";
//      }
//      if(/^\d+$/.test(v))
//      {
//        return "全数字";
//      }
//      if(/^[a-z]+$/i.test(v))
//      {
//        return "全字母";
//      }
//      if(!/^[A-Za-z0-9]+$/.test(v))
//      {
//        return "只能含有数字有字母";
//      }
//      return "正确";
//    };