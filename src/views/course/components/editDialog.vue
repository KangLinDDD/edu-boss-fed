<template>
    <div class="editDialog">
        <el-dialog :title="title"
                   :close-on-click-modal="false"
                   :before-close="cancel"
                   :visible="visiable">
            <el-form :model="form"
                     :rules="rules"
                     ref="form"
                     label-width="80px">
                <el-form-item :label="'课程名称'"
                              prop="courseName">
                    <el-input disabled
                              v-model="form.courseName"></el-input>
                </el-form-item>
                <el-form-item :label="'章节名称'"
                              prop="sectionName">
                    <el-input v-model="form.sectionName"></el-input>
                </el-form-item>
                <el-form-item :label="'章节描述'">
                    <el-input type="textarea"
                              v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item :label="'章节排序'">
                    <el-input type="number"
                              v-model="form.orderNum">
                        <template slot="append">数字控制排序，数字越大越靠后</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary"
                           @click="save">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateSection } from '@/services/course-section'
import { Form } from 'element-ui'
export default Vue.extend({
    name: 'EditDialog',
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        title: {
            type: String,
            default: ''
        },
        visiable: {
            type: Boolean,
            default: false
        },
        courseName: {
            type: String,
            default: ''
        }
    },
    watch: {
        data: {
            handler (n: any) {
                this.form = JSON.parse(JSON.stringify(n))
                this.form.courseName = this.courseName
            },
            deep: true
        }
    },
    data () {
        return {
            form: {
                courseName: ''
            },
            rules: {
                courseName: [
                    {
                        required: true, message: '请输入课程名称', trigger: 'blur'
                    }
                ],
                sectionName: [
                    {
                        required: true, message: '请输入章节名称', trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        cancel () {
            this.$emit('update:visiable', false)
        },
        save () {
            (this.$refs.form as Form).validate((valid: boolean) => {
                if (!valid) {
                    return
                }
                saveOrUpdateSection(this.form).then((res: any) => {
                    const { data } = res
                    if (data.code !== '000000') {
                        this.$message({
                            type: 'error',
                            message: data.mesg
                        })
                        return
                    }
                    this.cancel()
                    this.$emit('update')
                })
            })
        }
    }
})
</script>

<style lang="scss" scoped>
</style>