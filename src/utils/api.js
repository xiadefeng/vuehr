/**
 * 定义一个统一消息提示工具类
 */
import axios from 'axios';
import { Message } from "element-ui";
import router from "../router/index"

axios.interceptors.response.use(success => {
    // 业务逻辑发生错误
    if (success.status && success.status == 200 && success.data.status == 500) {
        Message.error({message:success.data.msg});
        return;
    }
    // 如果业务逻辑返回成功的数据则以 Message 显示
    if (success.data.msg) {
        Message.success({message:success.data.msg});
    }
    // 返回成功的 json
    return success.data;
},error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message:'服务器被吃了( ╯□╰ )'});
    } else if (error.response.status == 403) {
        Message.error({message:'权限不足，请联系管理员'});
    } else if (error.response.status == 401) {
        Message.error({message:'尚未登陆，请先登陆'});
        router.replace("/"); //重回登陆页
    } else {
        if (error.response.data.msg) {
            Message.error({message:error.response.data.msg});
        } else {
            Message.error({message:'未知错误！'});
        }
    }
    return;
});

let base = '';

/**
 * post K/V 格式请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const postKeyValueRequest = (url,params) => {
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params,
        transformRequest:[function(data) {
            let ret = '';
            for (let i in data) {
                ret+=encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            }
            return ret;
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    });
};

/**
 * post JSON 格式请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const postRequest = (url,params) => {
  return axios({
      method:'post',
      url:`${base}${url}`,
      data:params
  });
};

/**
 * put 格式请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const putRequest = (url,params) => {
    return axios({
        method:'put',
        url:`${base}${url}`,
        data:params
    });
};

/**
 * get 格式请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const getRequest = (url,params) => {
    return axios({
        method:'get',
        url:`${base}${url}`,
        data:params
    });
};

/**
 * delete 格式请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {AxiosPromise}
 */
export const deleteRequest = (url,params) => {
    return axios({
        method:'delete',
        url:`${base}${url}`,
        data:params
    });
};