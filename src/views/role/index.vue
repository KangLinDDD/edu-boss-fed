<template>
    <div class="role">
        <role-list></role-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoleList from './components/list.vue'
export default Vue.extend({
    name: 'Role',
    data () {
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px'
        }
    },
    components: {
        RoleList
    }
})
</script>

<style lang="scss" scoped>
</style>
