<template>
    <el-card class="createOrUpdate"
             v-loading="loading">
        <div slot='header'>
            <el-steps :active='activeStep'
                      simple>
                <el-step :title='step.title'
                         v-for='step in steps'
                         :key='step.index'
                         @click.native='changeStep(step.index)'
                         :icon='step.icon'></el-step>
            </el-steps>
        </div>
        <el-form :model='form'
                 :rules='rules'
                 label-width='100px'>
            <div v-show='activeStep === step.index'
                 v-for='step in steps'
                 :key='step.index'>
                <div v-show='activeStep === 0'>
                    <el-form-item :label="'课程名称'">
                        <el-input v-model="form.courseName"></el-input>
                    </el-form-item>
                    <el-form-item :label="'课程简介'">
                        <el-input v-model="form.brief"></el-input>
                    </el-form-item>
                    <el-form-item :label="'课程概述'">
                        <el-input type="textarea"
                                  style="margin-bottom: 10px;"
                                  placeholder="概述1"
                                  v-model="form.previewFirstField"></el-input>
                        <el-input type="textarea"
                                  placeholder="概述2"
                                  v-model="form.previewSecondField"></el-input>
                    </el-form-item>
                    <el-form-item :label="'讲师姓名'">
                        <el-input v-model="form.teacherDTO.teacherName"></el-input>
                    </el-form-item>
                    <el-form-item :label="'讲师简介'">
                        <el-input v-model="form.teacherDTO.description"></el-input>
                    </el-form-item>
                    <el-form-item :label="'课程排序'">
                        <el-input-number v-model="form.sortNum"></el-input-number>
                    </el-form-item>
                </div>
                <div v-show='activeStep === 1'>
                    <el-form-item :label="'课程封面'">
                        <!-- 组件需要根据绑定的数据进行图片预览 -->
                        <!-- 组件需要把上传成功的图片地址同步到绑定的数据中 -->
                        <!-- v-model 本质还是父子组件通信  会给子组件传递一个名字叫value 的数据 -->
                        <!-- 子组件默认监听input事件，修改绑定的数据 -->
                        <course-img v-model="form.courseListImg"
                                    :limit="5"></course-img>
                    </el-form-item>
                    <el-form-item :label="'解锁封面'">
                        <course-img v-model="form.courseImgUrl"
                                    :limit="2"></course-img>
                    </el-form-item>
                </div>
                <div v-show='activeStep === 2'>
                    <el-form-item :label="'售卖价格'"
                                  prop="price">
                        <el-input v-model="form.discounts">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'商品原价'">
                        <el-input v-model="form.price">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'销量'">
                        <el-input v-model="form.sales">
                            <template slot="append">单</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'活动标签'">
                        <el-input v-model="form.discountsTag">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </div>
            </div>
            <div v-show='activeStep === 3'>
                <el-form-item :label="'限时秒杀开关'"
                              :width="150"
                              prop="activityCourse">
                    <el-switch v-model="form.activityCourse"
                               active-color="#13ce66"
                               inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <template v-if="form.activityCourse">
                    <el-form-item :label="'开始时间'">
                        <el-date-picker v-model="form.activityCourseDTO.beginTime"
                                        type="date"
                                        value-format="yyyy-mm-dd"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="'结束时间'">
                        <el-date-picker v-model="form.activityCourseDTO.endTime"
                                        type="date"
                                        value-format="yyyy-mm-dd"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="'秒杀价'">
                        <el-input v-model="form.activityCourseDTO.amount">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'秒杀库存'">
                        <el-input v-model="form.activityCourseDTO.stock"></el-input>
                    </el-form-item>
                </template>
            </div>
            <div v-show='activeStep === 4'>
                <el-form-item :label="'课程详情'">
                    <!-- <el-input type="textarea"
                                  v-model="form.courseDescriptionMarkDown"></el-input> -->
                    <text-editor v-model="form.courseDescriptionMarkDown"></text-editor>
                </el-form-item>
                <el-form-item :label="'是否发布'">
                    <el-switch v-model="form.status"
                               :active-value="1"
                               :inactive-value="0"></el-switch>
                    <el-input type="textarea"
                              v-model="form.courseDescriptionMarkDown"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="save">保存</el-button>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type='default'
                           v-show="activeStep !== steps.length - 1 && activeStep < steps.length - 1"
                           @click="next">下一步</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import TextEditor from '@/components/text-editor/index.vue'
import CourseImg from './courseImg.vue'
import { saveOrUpdateCourse, queryCourse } from '@/services/courses'
export default Vue.extend({
    name: 'CreateOrUpdate',
    components: {
        CourseImg,
        TextEditor
    },
    data () {
        return {
            activeStep: 0,
            form: {
                courseName: '',
                brief: '',
                teacherDTO: {
                    teacherName: '',
                    teacherHeadPicUrl: '',
                    position: '',
                    description: ''
                },
                courseDescriptionMarkDown: '',
                price: 0,
                discounts: 0,
                priceTag: '',
                discountsTag: '',
                isNew: true,
                isNewDes: '',
                courseListImg: '',
                courseImgUrl: '',
                sortNum: 0,
                previewFirstField: '',
                previewSecondField: '',
                status: 0, // 1已发布 0 未发布
                sales: 0,
                activityCourse: false,
                activityCourseDTO: {
                    beginTime: '',
                    endTime: '',
                    amount: 0,
                    stock: 0
                },
                autoOnlineTime: ''
            },
            steps: [
                {
                    index: 0,
                    title: '基本信息',
                    icon: 'el-icon-edit'
                },
                {
                    index: 1,
                    title: '课程封面',
                    icon: 'el-icon-upload'
                },
                {
                    index: 2,
                    title: '销售信息',
                    icon: 'el-icon-picture'
                },
                {
                    index: 3,
                    title: '秒杀活动',
                    icon: 'el-icon-picture'
                },
                {
                    index: 4,
                    title: '课程详情',
                    icon: 'el-icon-picture'
                }
            ],
            imageUrl: '', // 预览图片地址
            rules: {
                price: [
                    {
                        required: true, message: '请输入课程售价', trigger: 'blur'
                    }
                ]
            },
            loading: false
        }
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        courseId: {
            type: [String, Number],
            default: ''
        }
    },
    created () {
        if (this.isEdit) {
            this.getData()
        }
    },
    methods: {
        getData () {
            this.loading = true
            queryCourse(this.courseId).then((res: any) => {
                const { data } = res
                if (data.code !== '000000') {
                    this.loading = false
                    return
                }
                // 没有秒杀活动的信息则补上
                if (!data.data.activityCourseDTO) {
                    data.data.activityCourseDTO = {
                        beginTime: '',
                        endTime: '',
                        amount: 0,
                        stock: 0
                    }
                }
                this.form = data.data
                this.loading = false
            })
        },
        /**
         * @description 下一步
         * @param {*}
         * @return {*}
         */
        next () {
            if (this.activeStep < this.steps.length) {
                this.activeStep++
            }
        },
        /**
         * @description 跳转步骤
         * @param {*} step
         * @return {*}
         */
        changeStep (step: number) {
            this.activeStep = step
        },
        handleAvatarSuccess (res: any, file: any) {
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        beforeAvatarUpload (file: any) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        /**
         * @description 保存课程
         * @param {*}
         * @return {*}
         */
        save () {
            this.loading = true
            saveOrUpdateCourse(this.form).then((res: any) => {
                const { data } = res
                this.loading = false
                if (data.code === '000000') {
                    // 保存成功回退到列表页
                    this.$router.back()
                }
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.createOrUpdate {
    .el-step {
        cursor: pointer;
    }
}
</style>