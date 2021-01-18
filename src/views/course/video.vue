<template>
    <div class="course-video">
        <el-card>
            <el-form :model="form"
                     label-width="100px">
                <el-form-item label="课程"
                              prop="courseName">
                    <el-input v-model="courseName"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="课时"
                              prop="theme">
                    <el-input disabled
                              v-model="theme"></el-input>
                </el-form-item>
                <el-form-item label="视频上传">
                    <upload :files.sync="videoFile">
                        <el-button type="primary">选择视频</el-button>
                    </upload>
                </el-form-item>
                <el-form-item label="封面上传">
                    <upload :files.sync="imgFile">
                        <el-button type="primary">选择封面</el-button>
                    </upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="upload">开始上传</el-button>
                    <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Upload from './components/upload.vue'
import { getAliyunImagUploadAddressAdnAuth, getAliyunVideoUploadAddressAdnAuth } from '../../services/aliyun-upload'
export default Vue.extend({
    name: 'course-video',
    components: {
        Upload
    },
    data () {
        return {
            form: {},
            uploader: {},
            videoFile: null,
            imgFile: null,
            imageUrl: '',
            courseName: '',
            theme: '',
            courseId: ''
        }
    },
    created () {
        const { courseName, theme, courseId } = this.$route.query
        this.courseName = courseName as string
        this.theme = theme as string
        this.courseId = courseId as string
        this.initUploader()
    },
    methods: {
        initUploader () {
            const uploader = new window.AliyunUpload.Vod({
                // 阿里账号ID，必须有值
                userId: '1618139964448548',
                // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
                region: '',
                // 分片大小默认1 MB，不能小于100 KB
                partSize: 1048576,
                // 并行上传分片个数，默认5
                parallel: 5,
                // 网络原因失败时，重新上传次数，默认为3
                retryCount: 3,
                // 网络原因失败时，重新上传间隔时间，默认为2秒
                retryDuration: 2,
                // 开始上传
                onUploadstarted: (uploadInfo: any) => {
                    // 1、通过后端获取文件上传凭证
                    let uploadFn = null
                    if (uploadInfo.isImage) {
                        uploadFn = getAliyunImagUploadAddressAdnAuth
                        // 获取图片上传凭证
                        getAliyunImagUploadAddressAdnAuth()
                    } else {
                        // 获取视频上传凭证
                        uploadFn = getAliyunVideoUploadAddressAdnAuth.bind(null, {
                            fileName: uploadInfo.file.name,
                            imageUrl: this.imageUrl
                        })
                    }
                    // 2、调用upload.setUploadAuthAndAddress 设置上传凭证
                    this.handleUploadFn(uploadFn, uploadInfo)
                    //  uploader.setUploadAuthAndAddress(uploadInfo,uploadAuth, uploadAddress, videoId)
                    console.log('开始上传', uploadInfo)
                },
                // 文件上传成功
                onUploadSucceed: (uploadInfo: any) => {
                    console.log('上传成功', uploadInfo)
                },
                // 文件上传失败
                onUploadFailed: function (uploadInfo: any, code: any, message: any) {
                    console.log('上传失败', uploadInfo, code, message)
                },
                // 文件上传进度，单位：字节
                onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {
                    console.log('上传进度', uploadInfo, totalSize, loadedPercent)
                },
                // 上传凭证超时
                onUploadTokenExpired: function (uploadInfo: any) {
                    console.log('上传超时', uploadInfo)
                },
                // 全部文件上传结束
                onUploadEnd: function (uploadInfo: any) {
                    console.log('上传结束', uploadInfo)
                }
            })
            this.uploader = uploader
        },
        /**
         * @description 上传所以内容
         * @param {*}
         * @return {*}
         */
        upload () {
            // 获取上传得文件 视频+封面
            const videoFile = (this.videoFile as any).raw
            const imgFile = (this.imgFile as any).raw
            console.log(imgFile)
            const uploader = this.uploader as any
            // 将用户选中得文件添加到上传文档种
            uploader.addFile(imgFile, null, null, null, '{"Vod": {}}')
            uploader.addFile(videoFile, null, null, null, '{"Vod": {}}')
            // 开始上传，一旦开始上传，就会按照列表中添加得顺序上传文件
            uploader.startUpload()
        },
        /**
         * @description 返回上一页面
         * @param {*}
         * @return {*}
         */
        back () {
            this.$router.back()
        },
        handleUploadFn (fn: Function, uploadInfo: any) {
            fn().then((res: any) => {
                const { data } = res
                let auth = null
                if (data.code !== '000000') {
                    // uploadAddressAndAuth = null
                    // this.imageUrl = ''
                    this.$message.error('获取凭证失败!')
                    return
                }
                auth = data.data
                // 如果是图片则设置imageUrl
                if (uploadInfo.isImage) {
                    this.imageUrl = data.data.imageURL
                }
                ; (this.uploader as any).setUploadAuthAndAddress(
                    uploadInfo,
                    (auth as any).uploadAuth,
                    (auth as any).uploadAddress,
                    (auth as any).imageId || (auth as any).videoId
                )
                // 3、设置好上传凭证确认没有问题，上传进度开始
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.course-video {
    height: 100%;
    .el-card {
        height: 100%;
        .el-form {
            width: 60%;
            margin: 0 auto;
        }
    }
}
</style>