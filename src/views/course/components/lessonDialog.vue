<template>
    <div class="addLesson">
        <el-dialog :title="title"
                   :visible.sync="visiable"
                   :close-on-click-modal="false"
                   :before-close="cancel">
            <el-form :model="form"
                     ref="form"
                     :rules="rules"
                     label-width="100px">
                <el-form-item :label="'课程名称'"
                              prop="courseName">
                    <el-input disabled
                              v-model="form.courseName"></el-input>
                </el-form-item>
                <el-form-item :label="'章节名称'"
                              prop="sectionName">
                    <el-input disabled
                              v-model="form.sectionName"></el-input>
                </el-form-item>
                <el-form-item :label="'课时名称'"
                              prop="theme">
                    <el-input v-model="form.theme"></el-input>
                </el-form-item>
                <el-form-item :label="'时长'"
                              prop="duration">
                    <el-input v-model="form.duration"
                              type="number">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="'是否开放试听'">
                    <el-switch v-model="form.isFree"></el-switch>
                </el-form-item>
                <el-form-item :label="'课时排序'">
                    <el-input v-model="form.orderNum"
                              type="number">
                        <template slot="append">数字控制排序，数字越大越靠后</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button @click="save"
                           type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdate } from '@/services/course-section'
import { Form } from 'element-ui'
export default Vue.extend({
    name: 'AddLesson',
    props: {
        title: {
            type: String,
            default: '',
            required: true
        },
        visiable: {
            type: Boolean,
            default: false,
            required: true
        },
        data: {
            type: Object,
            default: () => ({})
        },
        courseName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            form: {
                courseId: '',
                sectionId: '',
                theme: '',
                duration: '',
                isFree: false,
                orderNum: '',
                status: ''
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
                ],
                theme: [
                    {
                        required: true, message: '请输入课时名称', trigger: 'blur'
                    }
                ],
                duration: [
                    {
                        required: true, message: '请输入时长', trigger: 'blur'
                    }
                ]
            }
        }
    },
    watch: {
        data: {
            handler (n: any) {
                this.form = JSON.parse(JSON.stringify(n))
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        cancel () {
            (this.$refs.form as Form).clearValidate()
            this.$emit('update:visiable', false)
        },
        save () {
            (this.$refs.form as Form).validate((valid: boolean) => {
                if (!valid) {
                    return
                }
                saveOrUpdate(this.form).then((res: any) => {
                    const { data } = res
                    if (data.code !== '000000') {
                        this.$message({
                            type: 'error',
                            message: data.mesg
                        })
                        return
                    }
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
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