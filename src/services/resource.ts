// 菜单资源相关请求模块
import request from '@/utils/request'
export const getResourcePages = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/resource/getResourcePages',
        data
    })
}
export const getAllCategories = () => {
    return request({
        method: 'GET',
        url: '/boss/resource/category/getAll'
    })
}
export const allocateRoleResources = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/resource/allocateRoleResources',
        data
    })
}
export const getRoleResources = (roleId: number | string) => {
    return request({
        method: 'GET',
        url: '/boss/resource/getRoleResources',
        params: {
            roleId
        }
    })
}
export const getAllResources = () => {
    return request({
        method: 'GET',
        url: '/boss/resource/getAll'
    })
}