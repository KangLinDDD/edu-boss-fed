<template>
    <div class="resource-list">
        <el-card class="box-card">
            <div slot="header"
                 class="clearfix">
                <el-form ref="form"
                         :model="form"
                         :inline="true"
                         label-width="80px">
                    <el-form-item prop="name"
                                  label="资源名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="url"
                                  label="资源路径">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item prop="categoryId"
                                  label="资源分类">
                        <el-select v-model="form.categoryId"
                                   placeholder="请选择资源分类"
                                   clearable>
                            <el-option :label="item.name"
                                       :value="item.id"
                                       v-for="item in resourceCategories"
                                       :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   @click="onSubmit"
                                   :disabled="loading">查询搜索</el-button>
                        <el-button @click="onReset"
                                   :disabled="loading">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="resources"
                      v-loading="loading">
                <el-table-column :label="'编号'"
                                 type="index"></el-table-column>
                <el-table-column :label="'资源名称'"
                                 prop="name"></el-table-column>
                <el-table-column :label="'资源路径'"
                                 prop="url"></el-table-column>
                <el-table-column :label="'描述'"
                                 prop="description"></el-table-column>
                <el-table-column :label="'添加时间'">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                <el-table-column :label="'操作'">
                    <template slot-scope="scope">
                        <el-button form.size="mini"
                                   type="default"
                                   @click="edit(scope.row)">编辑</el-button>
                        <el-button form.size="mini"
                                   type="primary"
                                   @click="del">删除</el-button>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, getAllCategories } from '@/services/resource'
import { formatDate } from '@/utils/util.ts'
import { Form } from 'element-ui'
export default Vue.extend({
    name: 'ResourceList',
    data () {
        return {
            form: {
                name: '',
                url: '',
                current: 1, // 默认查询第1页数据
                size: 5, // 每页大小
                categoryId: null // 资源分类
            },
            resources: [],
            resourceCategories: [],
            total: 0,
            loading: false
        }
    },
    created () {
        this.loadResource()
        this.getAllCategories()
    },
    methods: {
        formatDate,
        onSubmit () {
            this.form.current = 1
            this.loadResource()
        },
        /**
         * @description 重置表单
         * @param {*}
         * @return {*}
         */
        onReset () {
            (this.$refs.form as Form).resetFields()
            this.form.current = 1
            this.loadResource()
        },
        loadResource () {
            this.loading = true
            getResourcePages(this.form).then(res => {
                const { data } = res
                if (data.code === '000000') {
                    this.resources = data.data.records
                    this.total = data.data.total
                    this.form.current = data.data.current
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        /**
         * @description 编辑
         * @param {Object} row 行数据
         * @return {*}
         */
        edit (row: any) {
            console.log(row)
        },
        /**
         * @description 删除
         * @param {Object} row 行数据
         * @return {*}
         */
        del (row: any) {
            console.log(row)
        },
        handleSizeChange (val: number) {
            this.form.size = val
            this.form.current = 1
            this.loadResource()
        },
        handleCurrentChange (val: number) {
            this.form.current = val
            this.loadResource()
        },
        /**
         * @description 加载所有的资源分类
         * @param {*}
         * @return {*}
         */
        getAllCategories () {
            getAllCategories().then(res => {
                const { data } = res
                if (data.code === '000000') {
                    this.resourceCategories = data.data
                }
            })
        }
    }
})
</script>

<style lang="scss" scoped>
</style>
