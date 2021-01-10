<template>
    <el-container class="layout">
        <el-aside width="200px">
            <app-aside />
        </el-aside>
        <el-container class="contents">
            <el-header>
                <app-header></app-header>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts">
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'
export default Vue.extend({
    data () {
        return {}
    },
    components: {
        AppHeader,
        AppAside
    }
})
</script>
<style lang="scss" scoped>
.el-container {
    min-height: 100vh;
    min-width: 980px;

    &.contents {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 200px;
    }
}
.el-aside {
    background-color: #d4dce6;
}
.el-header {
    background-color: #fff;
}
.el-main {
    background-color: #e9eef3;
}
</style>
