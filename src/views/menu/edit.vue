<template>
    <div class="createMenu">
        <create-or-edit :isEdit="true"></create-or-edit>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/create-or-edit.vue'
export default Vue.extend({
    name: 'createMenu',
    components: {
        CreateOrEdit
    }
})
</script>

<style lang="scss">
</style>
