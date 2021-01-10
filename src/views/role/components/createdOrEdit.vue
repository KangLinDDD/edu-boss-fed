<template>
    <div class="createOrEdit">
        <el-form :model="form"
                 ref="form"
                 :rules="rules"
                 :label-position="'left'"
                 label-width="100px">
            <el-form-item :label="'角色名称：'"
                          prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="'角色编码：'"
                          prop="code">

                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item :label="'描述：'"
                          prop="description">
                <el-input type="textarea"
                          v-model="form.description"></el-input>
            </el-form-item>
            <el-row class="ops">
                <el-button type="default"
                           @click="close">取消</el-button>
                <el-button type="primary"
                           @click="confirm">确定</el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { createOrUpdate } from '@/services/role'
export default Vue.extend({
    name: 'CreateOrEdit',
    data () {
        return {
            form: {
                name: '',
                code: '',
                description: '',
                id: ''
            },
            rules: {
                name: [
                    {
                        required: true, message: '请输入角色名称', trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true, message: '请输入角色编码', trigger: 'blur'
                    }
                ]
            }
        }
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        update: {
            type: Function,
            default: () => {
                return function () {
                    // do
                }
            }
        }
    },
    watch: {
        data: {
            handler (n) {
                console.log(n)
                const { name = '', code = '', description = '', id = '' } = n
                this.form.name = name
                this.form.code = code
                this.form.description = description
                this.form.id = id
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        /**
         * @description 确认
         * @param {*}
         * @return {*}
         */
        confirm () {
            (this.$refs.form as Form).validate((valid: boolean) => {
                valid && createOrUpdate(this.form).then(res => {
                    if (res.data.code === '000000') {
                        this.close()
                        this.update()
                    }
                })
            })
        },
        /**
         * @description 获取数据
         * @param {*}
         * @return {*}
         */
        getData () {
            console.log('aa')
        },
        /**
         * @description 关闭弹窗
         * @param {*}
         * @return {*}
         */
        close () {
            (this.$refs.form as Form).resetFields()
            this.$emit('update:visible', false)
        }
    }
})
</script>

<style lang="scss" scoped>
.createOrEdit {
    .ops {
        text-align: right;
    }
}
</style>