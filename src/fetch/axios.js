import axios from 'axios';
import Cookie from 'js-cookie';

// xhr请求带上seetion
// axios.defaults.withCredentials = true

// console.log(process)
// console.log(process.env);

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://47.52.66.81:8080' : process.env.REACT_APP_API_URL;

axios.interceptors.request.use(function (config) {
    const token = Cookie.get('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  // 用户登录状态失效，自动跳转到登录
  if (['10002'].includes(response.data.code)) {
    Cookie.remove('token');
  }
  return response;
}, function(error) {
  return Promise.reject(error);
})

export default axios;

global.URLCONFIGJSON = {emulateJson: true, headers: {"Content-Type": "application/json",'X-Request-Uri':'/'}};
global.URLCONFIGFORMDATA = {emulateJson: true, headers: {"Content-Type": "multipart/form-data",'X-Request-Uri':'/'}};
global.BACK_URL = 'http://ltalk-website.oss-cn-hangzhou.aliyuncs.com/';   //图片地址

// 交易所地址
if (process.env.NODE_ENV !== 'development') {
  if (process.env.REACT_APP_API_URL === 'http://47.52.66.81:8080') {
    global.BT_URL = 'http://47.52.202.171/';
  }
  if (process.env.REACT_APP_API_URL === 'https://shop.bttmall.com/shopAPI') {
    global.BT_URL =  'https://bttmall.com/';
  }
} else {
  global.BT_URL = 'http://47.52.202.171/';
}