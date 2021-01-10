// 用户相关请求模块
import request from '@/utils/request'
export const getRoles = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/role/getRolePages',
        data
    })
}
export const deleteRole = (id: string | number) => {
    return request({
        method: 'DELETE',
        url: `/boss/role/${id}`
    })
}
export const createOrUpdate = (data: any) => {
    return request({
        method: 'POST',
        url: '/boss/role/saveOrUpdate',
        data
    })
}
export const getAllRole = () => {
    return request({
        method: 'GET',
        url: '/boss/role/all'
    })
}
export const getUserRole = (userId: number | string) => {
    return request({
        method: 'GET',
        url: `/boss/role/user/${userId}`
    })
}
export const allocateUserRoles = (userId: number | string, roleIdList: Array<number | string>) => {
    return request({
        method: 'POST',
        url: '/boss/role/allocateUserRoles',
        data: {
            userId,
            roleIdList
        }
    })
}
