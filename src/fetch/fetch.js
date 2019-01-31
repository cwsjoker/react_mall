import axios from './axios.js';
import { addSearch } from '../utils/operLocation.js';


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
                console.log(res);
                // message.error(res.data.msg);
                // throw new Error(res.data.msg);
            }
        })
    }
}