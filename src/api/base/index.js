import store from "../../store/index.js";
import { Notification } from 'element-ui';
// import axios from "axios";
import qs from "qs"
import devApi from "../../../api.js"

let porApi = {
    "router": "/mars-dc-dm/router" 
}

let apiObject = process.env.NODE_ENV === 'development' ? devApi : porApi;
axios.interceptors.request.use(req => {
    setReqData(req, { v: store.state.v, appKey: store.state.appKey });
    if (req.method == "post") {
        if ("params" in req.data && Object.keys(req.data.params).length !== 0) {
            let obj = req.data.params;
            req.data.params = JSON.stringify(obj)
        }
        req.data = qs.stringify(req.data);
    }
    if (req.method === 'get' && req.params) {
        let url = req.url;
        url += '?'
        let keys = Object.keys(req.params)
        for (let key of keys) {
            url += `${key}=${encodeURIComponent(req.params[key])}&`       // 避开axios转码，单独转码
        }
        url = url.substring(0, url.length - 1)
        req.params = {}
        req.url = url;
    }
    return req;
})
axios.interceptors.response.use(res => {
    if (res.data.code != 0) {
        Notification({ type: `error`, title: "提示", message: res.data.message });
        return Promise.reject(res.data.code)
    }
    return res.data.data;
},(err=>{
    Notification({ type: `error`, title: "提示", message: "网络或服务器异常" });
    return Promise.reject(err);
}))

function setReqData(req, data) {
    if (req.method == "get") {
        Object.keys(data).forEach(val => {
            req.params[val] = data[val];
        })
    } else if (req.method == "post") {
        Object.keys(data).forEach(val => {
            req.data[val] = data[val];
        })
    }
}
const http = {
    get(url, data) {
        return axios.get(url, { params: data });
    },
    post(url, data) {
        return axios.post(url, data);
    }
}
Object.keys(apiObject).forEach(val => {
    http[val] = apiObject[val];
})
export default http;