<template>
    <div class="addCourse">
        <el-card>
            <div slot="header">
                <el-steps :active="activeStep"
                          simple>
                    <el-step :title="step.title"
                             v-for="step in steps"
                             :key="step.index"
                             @click.native="changeStep(step.index)"
                             :icon="step.icon"></el-step>
                </el-steps>
            </div>
            <el-form :model="form">
                <div v-show="activeStep === step.index"
                     v-for="step in steps"
                     :key="step.index">{{step.title}}</div>
                <el-form-item>
                    <el-button type="default"
                               v-show="activeStep !== steps.length - 1"
                               @click="next">下一步</el-button>
                    <el-button type="primary"
                               @click="submit"
                               v-show="activeStep === steps.length - 1">完成</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'AddCourse',
    data () {
        return {
            activeStep: 0,
            form: {},
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
            ]
        }
    },
    methods: {
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
         * @description 提交表单
         * @param {*}
         * @return {*}
         */
        submit () {
            console.log('提交')
        },
        /**
         * @description 跳转步骤
         * @param {*} step
         * @return {*}
         */
        changeStep (step: number) {
            this.activeStep = step
        }
    }
})
</script>

<style lang="scss" scope>
.addCourse {
    .el-step {
        cursor: pointer;
    }
}
</style>