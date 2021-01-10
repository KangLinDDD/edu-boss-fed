<template>
    <div class="createMenu">
        <el-card class="box-card">
            <div slot="header"
                 class="clearfix">
                <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
            </div>
            <el-form ref="form"
                     :model="form"
                     label-width="80px">
                <el-form-item label="菜单名称"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径"
                              prop="href">
                    <el-input v-model="form.href"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单"
                              prop="parentId">
                    <el-select v-model="form.parentId"
                               placeholder="请选择上级菜单">
                        <el-option :value="-1"
                                   label="无上级菜单"></el-option>
                        <el-option :label="item.name"
                                   :value="item.id"
                                   v-for="item in parentMenuList"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述"
                              prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="前端图标"
                              prop="icon">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="是否显示"
                              prop="shown">
                    <el-radio-group v-model="form.shown">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序"
                              prop="orderNum">
                    <el-input-number v-model="form.orderNum"
                                     :min="1"
                                     label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="onSubmit">提交</el-button>
                    <el-button v-if="!isEdit"
                               @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'
import { Form } from 'element-ui'
export default Vue.extend({
    name: 'MenuCreateOrEdit',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            form: {
                parentId: -1, // -1 表示没有上级菜单
                name: '',
                href: '',
                icon: '',
                orderNum: 0,
                description: '',
                shown: false
            },
            parentMenuList: [] // 父级菜单列表
        }
    },
    created () {
        this.getMenuInfo()
    },
    methods: {
        onSubmit () {
            // 表单验证
            // 验证通过，提交表单
            createOrUpdateMenu(this.form).then((res: any) => {
                const { data } = res
                // 提交成功
                if (data.code === '000000') {
                    this.$message.success('提交成功')
                    this.$router.back()
                }
            })
        },
        resetForm () {
            (this.$refs.form as Form).resetFields()
        },
        getMenuInfo () {
            // 从路由中获取id
            const { id } = this.$route.query
            let argv = -1
            // 如果id存在
            if (!isNaN(Number(id))) {
                argv = Number(id)
            }
            getEditMenuInfo(argv).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.parentMenuList = data.data.parentMenuList
                    this.form = data.data.menuInfo
                } else {
                    this.parentMenuList = []
                }
            })
        }
    }
})
</script>

<style lang="scss">
</style>
