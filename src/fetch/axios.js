import axios from 'axios';
import Cookie from 'js-cookie';

// const {
//   prod,
//   ws_test,
//   ws_dev,
//   http_test,
//   http_dev,
//   ws_pre_test,
//   http_pre_test,
//   ws_pro,
//   http_pro
// } = configPath;

// WS_PATH_MARKET 行情
// WS_PATH_EXCHANGE 交易
// KLINE_HISTORY k线历史
// MARKET_VALUATION_BTC btc估值
// HTTP_NEWS 新闻爬虫

// 开发环境
// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = process.env.API_ROOT;
//   global.WS_PATH_MARKET = ws_dev['market'];
//   global.WS_PATH_EXCHANGE = ws_dev['exchange'];
//   global.KLINE_HISTORY = http_dev['history'];
//   global.MARKET_VALUATION_BTC = http_dev['btc'];
//   global.HTTP_NEWS = http_dev['news'];
// }

// 生产环境

// xhr请求带上seetion
// axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://47.52.66.81:8080';

// const instance = axios.create();
axios.interceptors.request.use(function (config) {
    const token = Cookie.get('token');
    if (token) {
      // config.headers.Authorization = "Bearer " + token
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