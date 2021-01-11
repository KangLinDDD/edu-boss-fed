import request from '@/utils/request'
export const getCources = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/course/getQueryCourses',
        data
    })
}
export const changeState = (data: any) => {
    return request({
        method: 'GET',
        url: '/boss/course/changeState',
        params: data
    })
}