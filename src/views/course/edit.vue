<template>
    <div class="editCourse">
        <create-or-update is-edit :course-id="courseId"></create-or-update>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import createOrUpdate from './components/createOrUpdate.vue'
export default Vue.extend({
    name: 'EditCourse',
    components: {
        createOrUpdate
    },
    props: {
        courseId: {
            type: [String, Number],
            required: true
        }
    }
})
</script>

<style lang='scss' scoped>
</style>