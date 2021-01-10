<template>
    <div class="user"
         v-loading="loading">
        <header class="header">
            <el-form :model="form"
                     label-position="top">
                <el-form-item prop="phone"
                              label="手机号">
                    <el-input v-model="form.phone"
                              placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="注册时间">
                    <el-date-picker v-model="form.time"
                                    unlink-panels
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </header>
        <el-table :data="tableData">
            <el-table-column :label="'用户ID'"
                             prop="id"></el-table-column>
            <el-table-column :label="'头像'">
                <template slot-scope="scope">
                    <img class="headerImg"
                         :src="scope.row.portrait || defaultSrc"
                         alt="">
                </template>
            </el-table-column>
            <el-table-column :label="'用户名'"
                             prop="name"></el-table-column>
            <el-table-column :label="'手机号'"
                             prop="phone"></el-table-column>
            <el-table-column :label="'注册时间'">
                <template slot-scope="scope">
                    {{formatDate(scope.row.createTime, ' ', 'Y-M-d-h-m-0')}}
                </template>
            </el-table-column>
            <el-table-column :label="'状态'">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.isDel ? '已禁用' : '已启用'">
                        <el-switch v-model="scope.row.isDel"
                                   active-color="#ff4949"
                                   inactive-color="#13ce66"
                                   disabled>
                        </el-switch>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column :label="'操作'"
                             width="150">
                <template slot-scope="scope">
                    <el-button type="text"
                               v-show="!scope.row.isDel"
                               @click="forbidden(scope.row)">禁用</el-button>
                    <el-button type="text"
                               @click="distribute(scope.row)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="分配角色"
                   :visible.sync="visible"
                   :close-on-click-modal="false"
                   width="30%">
            <el-select multiple
                       v-model="roleIds">
                <el-option v-for="role in roleList"
                           :key="role.id"
                           :label="role.name"
                           :value="role.id"></el-option>
            </el-select>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary"
                           @click="distrabuteRole">确 定</el-button>
            </span>
        </el-dialog>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="form.current"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="form.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRole, getUserRole, allocateUserRoles } from '@/services/role'
import { formatDate } from '@/utils/util'
export default Vue.extend({
    name: 'User',
    data () {
        return {
            form: {
                phone: '',
                time: [],
                startCreateTime: '',
                endCreateTime: '',
                currentPage: 1,
                pageSize: 10
            },
            total: 0,
            loading: false,
            tableData: [],
            defaultSrc: 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg',
            visible: false,
            roleList: [],
            roleIds: [],
            userId: ''
        }
    },
    created () {
        this.getData()
        this.getAllRole()
    },
    methods: {
        /**
         * @description 格式化时间方法
         * @param {*}
         * @return {*}
         */
        formatDate,
        /**
         * @description 搜索功能
         * @param {*}
         * @return {*}
         */
        search () {
            if (this.form.time && this.form.time.length !== 0) {
                const [start, endTime] = this.form.time as any
                this.form.startCreateTime = start.getTime()
                this.form.endCreateTime = endTime.getTime()
            }
            this.getData()
        },
        /**
         * @description 获取页面数据
         * @param {*}
         * @return {*}
         */
        getData () {
            this.loading = true
            let startCreateTime
            let endCreateTime
            if (this.form.startCreateTime) {
                startCreateTime = new Date(this.form.startCreateTime)
            }
            if (this.form.endCreateTime) {
                endCreateTime = new Date(this.form.endCreateTime)
            }
            const data = Object.assign({}, this.form, {
                startCreateTime,
                endCreateTime
            })
            getUserPages(data).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.total = data.data.total
                    this.tableData = data.data.records
                }
            }).finally(() => {
                this.loading = false
            })
        },
        /**
         * @description 获取所有的角色 用于分配
         * @param {*}
         * @return {*}
         */
        getAllRole () {
            getAllRole().then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.roleList = data.data
                }
            })
        },
        /**
         * @description 禁用当前行
         * @param {Object} row 当前行数据
         * @return {*}
         */
        forbidden (row: any) {
            console.log(row)
            forbidUser(row.id).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    row.isDel = true
                    this.$message({
                        type: 'success',
                        message: '禁用成功'
                    })
                    return
                }
                console.log(data)
                // 没有禁用成功 则提示
                this.$message({
                    type: 'error',
                    message: data.mesg
                })
            })
        },
        /**
         * @description 分配角色
         * @param {Object} row 当前行数据
         * @return {*}
         */
        distribute (row: any) {
            this.userId = row.id
            getUserRole(row.id).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.roleIds = data.data.map((role: any) => role.id)
                    this.visible = true
                }
            })
        },
        /**
         * @description 每页数量改变之后的回调
         * @param {*} size
         * @return {*}
         */
        handleSizeChange (size: number) {
            this.form.pageSize = size
            this.getData()
        },
        /**
         * @description 页码改变之后的回调
         * @param {*} current
         * @return {*}
         */
        handleCurrentChange (current: number) {
            this.form.currentPage = current
            this.getData()
        },
        /**
         * @description 关闭分配角色弹窗
         * @param {*}
         * @return {*}
         */
        close () {
            this.visible = false
        },
        /**
         * @description 分配角色保存
         * @param {*}
         * @return {*}
         */
        distrabuteRole () {
            allocateUserRoles(this.userId, this.roleIds).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.userId = ''
                    this.$message({
                        type: 'success',
                        message: '分配成功'
                    })
                    this.close()
                } else {
                    this.$message({
                        type: 'error',
                        message: data.mesg
                    })
                }
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.user {
    .header {
        .el-form {
            display: flex;
            align-items: flex-end;
            .el-form-item {
                margin-right: 8px;
            }
        }
    }
    .el-table {
        .headerImg {
            margin-right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            box-sizing: border-box;
            vertical-align: middle;
        }
    }
    .el-dialog {
        .el-select {
            width: 80%;
        }
    }
}
</style>
