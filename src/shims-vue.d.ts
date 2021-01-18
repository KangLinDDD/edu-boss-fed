// 让 typescript 识别vue代码
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface Window {
    AliyunUpload: any
}