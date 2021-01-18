<template>
    <div class="course"
         v-loading="loading">
        <el-card class="box-card">
            <div slot="header"
                 class="clearfix">
                <el-form :model="form"
                         :inline="true"
                         label-width="80">
                    <el-form-item :label="'课程名称'">
                        <el-input v-model="form.courseName"
                                  @keyup.enter.native="search"
                                  placeholder="课程名称"></el-input>
                    </el-form-item>
                    <el-form-item :label="'状态'">
                        <el-select v-model="form.status">
                            <el-option v-for="status in statusArr"
                                       :key="status.value"
                                       :label="status.name"
                                       :value="status.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="default"
                                   @click="search">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   @click="add">添加课程</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData">
                <el-table-column :label="'ID'"
                                 prop="id"></el-table-column>
                <el-table-column :label="'课程名称'"
                                 prop="courseName"></el-table-column>
                <el-table-column :label="'价格'"
                                 prop="price"></el-table-column>
                <el-table-column :label="'排序'"
                                 prop="sortNum"></el-table-column>
                <el-table-column :label="'状态'"
                                 prop="sttaus">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status"
                                   :inactive-value="1"
                                   :active-value="0"
                                   active-color="#ff4949"
                                   inactive-color="#13ce66"
                                   disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="'操作'"
                                 width="250">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   :type="scope.row.status === 1 ? 'danger' : 'success'"
                                   @click="changeState(scope.row)">{{scope.row.status === 1 ? '下架' : '上架'}}</el-button>
                        <el-button size="mini"
                                   type="default"
                                   @click="edit(scope.row.id, scope.row.courseName)">编辑</el-button>
                        <el-button size="mini"
                                   type="default"
                                   @click="section(scope.row.id, scope.row.courseName)">内容管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="form.currentPagt"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="form.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCources, changeState } from '@/services/courses'
export default Vue.extend({
    name: 'Course',
    data () {
        return {
            form: {
                currentPage: 0,
                pageSize: 10,
                courseName: '',
                status: ''
            },
            statusArr: [
                {
                    name: '全部',
                    value: ''
                },
                {
                    name: '上架',
                    value: '1'
                },
                {
                    name: '下架',
                    value: '0'
                }
            ],
            tableData: [],
            loading: false,
            total: 0
        }
    },
    created () {
        this.getData()
    },
    methods: {
        /**
         * @description 搜索
         * @param {*}
         * @return {*}
         */
        search () {
            this.getData()
        },
        /**
         * @description 获取页面数据
         * @param {*}
         * @return {*}
         */
        getData () {
            this.loading = true
            getCources(this.form).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.tableData = data.data.records
                    this.total = data.data.total
                }
            }).finally(() => {
                this.loading = false
            })
        },
        /**
         * @description 改变状态
         * @param {Object} row
         * @return {*}
         */
        changeState (row: any) {
            this.loading = true
            let { id, status } = row
            status = status === 1 ? 0 : 1
            changeState({
                courseId: id, status
            }).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.$message({
                        type: 'success',
                        message: status === 1 ? '上架成功' : '下架成功'
                    })
                    row.status = status
                } else {
                    this.$message.error(data.mesg)
                }
            }).finally(() => {
                this.loading = false
            })
        },
        /**
         * @description 处理分页每页大小的回调
         * @param {Number} size
         * @return {*}
         */
        handleSizeChange (size: number) {
            this.form.pageSize = size
            this.form.currentPage = 1
            this.getData()
        },
        /**
         * @description 处理分页页数的回调
         * @param {Number} currentPage
         * @return {*}
         */
        handleCurrentChange (currentPage: number) {
            this.form.currentPage = currentPage
            this.getData()
        },
        /**
         * @description 添加课程
         * @param {*}
         * @return {*}
         */
        add () {
            this.$router.push({
                name: 'add-course'
            })
        },
        /**
         * @description 编辑
         * @param {String} courseId 课程id
         * @return {*}
         */
        edit (courseId: string) {
            this.$router.push({
                name: 'edit-course',
                params: {
                    courseId: courseId
                }
            })
        },
        /**
         * @description 内容管理
         * @param {Number||String} courseId 课程id
         * @return {*}
         */
        section (courseId: string, courseName: string) {
            this.$router.push({
                name: 'course-section',
                params: {
                    courseId: courseId,
                    courseName
                }
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.course {
    .el-form {
        .el-form-item {
            &:last-of-type {
                float: right;
            }
        }
    }
}
</style>
