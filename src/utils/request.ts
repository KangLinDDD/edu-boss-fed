import axios from 'axios'
import store from '@/store'
import router from '@/router'
import qs from 'qs'
import { Message } from 'element-ui'
const request = axios.create({
    // 配置选项
    // baseURL
    // timeout
})
let isRefreshing = false // 刷新token状态
let requests: Function[] = [] // 存储刷新token 期间过来的401请求
function redirectLogin () {
    router.push({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}
function refreshToken () {
    return axios.create()({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
            // refresh_token 只能用一次
            refreshtoken: store.state.user.refresh_token
        })
    })
}
function handlerRefreshToken (error: any) {
    // token无效，没有当前登陆人的信息则重新登陆
    if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
    }
    // 有登陆人信息则重新刷新token
    if (isRefreshing) {
        // 刷新状态下，把请求挂起放在 requests 中
        return new Promise(resolve => {
            requests.push(() => {
                // 把错误的请求重新发出去
                resolve(request(error.config))
            })
        })
    }
    // 多个接口时判断,因为刷新token的操作短时间内只能做一次
    // 没有刷新token则开始刷新
    isRefreshing = true // 开启刷新
    return refreshToken().then(res => {
        if (!res.data.success) {
            console.log(' 刷新Token失败，跳转登录页')
        }
        // 更新token
        store.commit('setUser', res.data.content)
        // 把requests 队列中的请求重新发出去
        requests.forEach(cb => cb())
        // 清空 requests 数组
        requests = []
        return request(error.config)
    }).catch(err => {
        // 失败之后把当前登陆用户状态清空
        store.commit('setUser', null)
        redirectLogin()
        return Promise.reject(err)
    }).finally(() => {
        isRefreshing = false // 重新刷新状态
    })
}
function handlerStatus (status: number, error: any) {
    switch (status) {
        case 400:
            Message.error('请求参数错误')
            break
        case 401: // token不正确，刷新token
            handlerRefreshToken(error)
            break
        case 403:
            Message.error('没有权限，请联系管理员')
            break
        case 404:
            Message.error('请求资源不存在')
            break
        default:
            if (status >= 500) {
                Message.error('服务端错误，请联系管理员')
            }
            break
    }
}
// 请求拦截器
request.interceptors.request.use(function (config) {
    // 在这里通过改写 config 配置信息来实现业务功能的统一处理
    const { user } = store.state
    if (user && user.access_token) {
        config.headers.Authorization = user.access_token
    }
    return config
}, function (error) {
    return Promise.reject(error)
})
request.interceptors.response.use(function (response) {
    // 状态码为2开头时，会进入这里
    // 如果是自定义的错误状态码，错误处理写到这里
    return response
}, async function (error) {
    // 超出2开头的状态码执行这里
    // 请求收到响应了，但是状态码超出了2开头的范围
    if (error.response) {
        const { status } = error.response
        handlerStatus(status, error)
    } else if (error.request) { // 请求发出去了但是没有收到响应
        Message.error('请求超时，请刷新重试')
    } else { // 请求的时候设置的相关信息发生的错误，一般是未知的
        Message.error(`请求失败:${error.message}`)
    }
    // 如果使用的时HTTP状态码，错误处理就写到这里
    // 把请求失败的错误对象继续抛出，扔给上一个调用者
    return Promise.reject(error)
})
export default request
