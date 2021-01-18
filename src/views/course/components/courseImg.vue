<template>
    <div class="course-img">
        <el-progress type="circle"
                     v-if="isUploading"
                     :width="178"
                     :status="percentage === 100 ? 'success' : undefined"
                     :percentage="percentage"></el-progress>
        <el-upload class='avatar-uploader'
                   v-else
                   action=''
                   :show-file-list='false'
                   :http-request="handleUpload"
                   :before-upload="beforeAvatarUpload">
            <img v-if="value"
                 :src="value"
                 class="avatar">
            <i v-else
               class='el-icon-plus avatar-uploader-icon'></i>
        </el-upload>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { uploadCourseImg } from '@/services/courses'
export default Vue.extend({
    name: 'CourseImg',
    data () {
        return {
            imageUrl: '',
            courseListImg: '',
            percentage: 0,
            isUploading: false
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        limit: {
            type: Number,
            default: 2
        }
    },
    methods: {
        handleAvatarSuccess (res: any, file: any) {
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        beforeAvatarUpload (file: any) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < this.limit
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
            }
            return isJPG && isLt2M
        },
        /**
         * @description 自定义上传
         * @param {*} options
         * @return {*}
         */
        handleUpload (options: any) {
            this.isUploading = true
            const fd = new FormData()
            fd.append('file', options.file)
            uploadCourseImg(fd, e => {
                this.percentage = Math.floor(e.loaded / e.total * 100)
            }).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.$emit('input', data.data.name)
                    this.$message.success('上传成功')
                } else {
                    this.$message.error(data.mesg)
                }
                this.isUploading = false
                this.percentage = 0
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.course-img {
    ::v-deep .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    ::v-deep .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>