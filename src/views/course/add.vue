<template>
    <div class='addCourse'>
        <create-or-update></create-or-update>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import createOrUpdate from './components/createOrUpdate.vue'
export default Vue.extend({
    name: 'AddCourse',
    components: {
        createOrUpdate
    }
})
</script>

<style lang='scss' scoped>
</style>