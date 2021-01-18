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
export const saveOrUpdateCourse = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/course/saveOrUpdateCourse',
        data
    })
}
export const uploadCourseImg = (data: any, onUploadProgress?: (progressEvent: ProgressEvent) => void) => {
    // 该接口要求的请求数据类型是 multipart/form-data
    // 所以需要提交formData数据对象
    return request({
        method: 'POST',
        url: '/boss/course/upload',
        data,
        /**
         * @description HTML5 新增的上传响事件  原生事件为progress
         * @param {any} e
         * @return {*}
         */
        onUploadProgress
    })
}
export const queryCourse = (courseId: string | number) => {
    return request({
        method: 'GET',
        url: '/boss/course/getCourseById',
        params: {
            courseId
        }
    })
}