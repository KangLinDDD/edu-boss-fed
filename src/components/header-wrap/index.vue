<template>
    <div class="header-wrap">
        <i class="el-icon-back back"
           v-show="isAllowBack"
           @click="back"></i>
        <div>{{title}}</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'HeaderWrap',
    props: {
        title: {
            type: String,
            default: ''
        },
        isAllowBack: {
            type: Boolean,
            default: false
        },
        backFn: {
            type: Function
        }
    },
    methods: {
        back () {
            if (this.backFn) {
                this.backFn()
                return
            }
            this.$router.back()
        }
    }
})
</script>
<style lang="scss" scoped>
.header-wrap {
    display: flex;
    align-items: center;
    .back {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>