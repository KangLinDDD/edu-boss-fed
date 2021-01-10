<template>
    <div class="roleLists"
         v-loading="loading">
        <el-card class="box-card">
            <div slot="header"
                 class="clearfix">
                <!-- <span>筛选搜索</span> -->
                <el-form ref="form"
                         :model="form">
                    <el-form-item label="角色名称"
                                  prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   @click="onSubmit"
                                   :disabled="saving">查询搜索</el-button>
                        <el-button :disabled="saving"
                                   @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="default"
                       @click="add">添加角色</el-button>
            <el-table :data="tableData"
                      :max-height="tableHeight">
                <el-table-column :label="'编号'"
                                 type="index"></el-table-column>
                <el-table-column :label="'角色名称'"
                                 prop="name"></el-table-column>
                <el-table-column :label="'角色编码'"
                                 prop="code"></el-table-column>
                <el-table-column :label="'描述'"
                                 prop="description"></el-table-column>
                <el-table-column :label="'添加时间'"
                                 prop="createdTime">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                <el-table-column :label="'操作'">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="distriMenu(scope.row)">分配菜单</el-button>
                        <el-button type="text"
                                   @click="distriSource(scope.row)">分配资源</el-button>
                        <el-button type="text"
                                   @click="edit(scope.row)">编辑</el-button>
                        <el-button type="text"
                                   @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="form.current"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="form.size"
                           layout="total, sizes, prev, pager, next, jumper"
                           :disabled="loading"
                           :total="total">
            </el-pagination>
        </el-card>
        <el-dialog :title="title"
                   :visible.sync="visible"
                   width="30%">
            <create-or-edit :visible.sync="visible"
                            :update="getListData"
                            :data="rowData"></create-or-edit>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './createdOrEdit.vue'
import { getRoles, deleteRole } from '@/services/role'
import { formatDate } from '@/utils/util'
import { Form } from 'element-ui'
export default Vue.extend({
    name: 'RoleList',
    data () {
        return {
            tableData: [],
            title: '添加角色',
            visible: false,
            form: {
                current: 1,
                size: 10,
                name: ''
            }, // 查询条件
            loading: false,
            saving: false,
            total: 0,
            tableHeight: 0,
            rowData: {}
        }
    },
    components: {
        CreateOrEdit
    },
    created () {
        this.getListData()
    },
    mounted () {
        this.$nextTick(() => {
            this.tableHeight = (document.querySelector('.el-main ') as HTMLElement).offsetHeight - (document.querySelector('.el-card__header') as HTMLElement).offsetHeight - 157
        })
    },
    methods: {
        /**
         * @description 分配菜单
         * @param {Object} row
         * @return {*}
         */
        distriMenu (row: any) {
            this.$router.push({
                name: 'alloc-menu',
                params: {
                    roleId: row.id
                }
            })
        },
        /**
         * @description 分配资源
         * @param {Object} row
         * @return {*}
         */
        distriSource (row: any) {
            this.$router.push({
                name: 'alloc-resource',
                params: {
                    roleId: row.id
                }
            })
        },
        /**
         * @description 编辑
         * @param {Object} row
         * @return {*}
         */
        edit (row: any) {
            this.title = '编辑角色'
            this.rowData = row
            this.showDialog()
        },
        /**
         * @description 删除
         * @param {Object} row
         * @return {*}
         */
        del (row: any) {
            this.$confirm('是否删除?', '提示').then(() => {
                deleteRole(row.id).then(res => {
                    const { data } = res
                    if (data.code === '000000') {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.getListData()
                        return
                    }
                    this.$message({
                        type: 'error',
                        message: data.mesg
                    })
                })
            })
        },
        /**
         * @description 展示弹窗
         * @param {*}
         * @return {*}
         */
        showDialog () {
            this.visible = true
        },
        /**
         * @description 添加角色
         * @param {*}
         * @return {*}
         */
        add () {
            this.title = '添加角色'
            this.showDialog()
        },
        /**
         * @description 获取列表数据
         * @param {*}
         * @return {*}
         */
        getListData () {
            this.loading = true
            getRoles(this.form).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.tableData = data.data.records
                    this.total = data.data.total
                }
            }).finally(() => {
                this.loading = false
                this.saving = false
            }).catch((e: any) => {
                console.log(e)
            })
        },
        formatDate,
        /**
         * @description 分页每页大小改变之后的回调
         * @param {*} val 每页大小
         * @return {*}
         */
        handleSizeChange (val: number) {
            this.form.size = val
            this.getListData()
        },
        /**
         * @description 分页页数改别之后的回调
         * @param {*} val 页数
         * @return {*}
         */
        handleCurrentChange (val: number) {
            this.form.current = val
            this.getListData()
        },
        /**
         * @description 查询去查询
         * @param {*}
         * @return {*}
         */
        onSubmit () {
            this.saving = true
            this.getListData()
        },
        /**
         * @description 查询去重置方法
         * @param {*}
         * @return {*}
         */
        onReset () {
            (this.$refs.form as Form).resetFields()
        }
    }
})
</script>

<style lang="scss" scoped>
</style>