<template>
    <el-upload class="upload-demo"
               action=""
               :auto-upload="false"
               :http-request="uploadFn"
               :on-change="handleChange"
               :file-list="fileList">
        <slot></slot>
    </el-upload>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'Upload',
    props: {
        files: {
            type: Object,
            default: () => ([])
        },
        uploadFn: {
            type: Function
        }
    },
    data () {
        return {
            fileList: []
        }
    },
    methods: {
        handleChange (file: any) {
            this.$emit('update:files', file)
        }
    }
})
</script>

<style>
</style>