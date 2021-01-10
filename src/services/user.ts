// 用户相关请求模块
import request from '@/utils/request'
import qs from 'qs'
interface User {
    phone: string
    password: string
}
export const login = (data: User) => {
    return request({
        method: 'POST',
        url: '/front/user/login',
        // 如果data是普通对象，则content-type会设置为application/json
        // 如果经过qs.stringify转换的数据，即： key=value&key=value
        // 则content-type会设置为application/x-www-form-urlencoded
        // 如果data是formData对象，则content-type会设置为multipart/form-data
        data: qs.stringify(data)
    })
}
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/front/user/getInfo'
    })
}
export const getUserPages = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/user/getUserPages',
        data
    })
}
export const forbidUser = (userId: number | string) => {
    return request({
        method: 'POST',
        url: '/boss/user/forbidUser',
        data: {
            userId
        }
    })
}