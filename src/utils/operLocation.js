/**
 * 获取url的查询对象
 * @param {*String url字符串} url 
 */
export function getQueryString(url) {
    const queryString = url.substr(url.indexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    queryString.replace(reg, function(rs, $1, $2) {
        const name = decodeURIComponent($1);
        const val = decodeURIComponent($2);
        obj[name] = val;
    })
    return obj;
}


/**
 * 接受一个对象转换成查询字符串
 * @param {*Object 查询对象} obj
 */
export function addSearch(obj) {
    if (obj) {
        let str="?"
        for(let i in obj) {
            if (obj[i] === 0 ||  obj[i] === '0' || obj[i] || obj[i] === false ||  obj[i] === 0) {
                 if(typeof(obj[i]) == "boolean"){
                     str += i + "=" + obj[i].toString() + "&";
                 }else{
                     str += i + "=" + obj[i] + "&";
                 }
            }
         }
         return str.substring(0,str.length-1);
     }else{
         return '';
     }
}