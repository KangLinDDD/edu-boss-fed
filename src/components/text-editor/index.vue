<template>
    <div ref="text-editor"
         class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImg } from '@/services/courses'
export default Vue.extend({
    name: 'TextEditor',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    // 组件已经渲染好，可以操作dom
    mounted () {
        this.initEditor()
    },
    methods: {
        initEditor () {
            const editor = new E(this.$refs['text-editor'] as any)
            // 监听事件必须写在创建之前
            editor.config.onchange = (value: any) => {
                console.log('change 之后最新的 html', value)
                this.$emit('input', value)
            }
            // 创建编辑器
            editor.create()
            editor.txt.html(this.value)
            editor.config.customUploadImg = function (resultFiles: any, insertImgFn: any) {
                // resultFiles 是 input 中选中的文件列表
                // insertImgFn 是获取图片 url 后，插入到编辑器的方法

                // 上传图片，返回结果，将图片插入到编辑器中
                // insertImgFn(imgUrl)
                const fd = new FormData()
                fd.append('file', resultFiles[0])
                uploadCourseImg(fd).then((res: any) => {
                    const { data } = res
                    if (data.code === '000000') {
                        insertImgFn(data.data.name)
                    }
                })
            }
        }
    }
})
</script>
<style lang="scss" scoped>
</style>