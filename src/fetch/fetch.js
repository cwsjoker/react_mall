import axios from './axios.js';
import { addSearch } from '../utils/operLocation.js';
import { message } from 'antd';


export class Fetch {
    // get请求
    static get(url, data) {
        const uri = url + addSearch(data);
        return Fetch.dealRespones(axios.get(uri, global.URLCONFIGJSON));
    }

    static postFormData(url, data) {
        const uri = url + addSearch(data);
        return Fetch.dealRespones(axios.post(uri));
    }

    // post form 请求
    static postForm(url, data) {
        return Fetch.dealRespones(axios.post(url, data, global.URLCONFIGFORMDATA));
    }

    // post json
    static post(url, data) {
        return Fetch.dealRespones(axios.post(url, data, global.URLCONFIGJSON));
    }

    // static postFormData(url , data) {
    //     return Fetch.dealRespones(axios.post(url, data, {emulateJson: true, headers: {"Content-Type": "application/x-www-form-urlencoded",'X-Request-Uri':'/'}}));
    // }
    
    static dealRespones(promise) {
        return promise.then(res => {
            if (res.data.code === '200') {
                return res;
            } else {
                if (['202', '203', '201', '204', '100234', '100235', '100236', '100237', '10002', '10001', '20001'].includes(res.data.code)) {
                    if (res.data.code === '10001') {
                        message.error('系统繁忙，请稍后再试');
                    } else {
                        message.error(res.data.msg);
                    }
                }
                // console.log(res);
            }
        })
    }
}