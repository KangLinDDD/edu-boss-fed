<template>
    <div class="alloc-resource"
         v-loading="loading">
        <el-card>
            <div slot="header">
                <span>分配资源</span>
                <div class="type"
                     v-for="category in categories"
                     :key="category.id">
                    <el-card class="header">
                        <div slot="header"
                             class="clearfix">
                            <el-checkbox :indeterminate="handlerIndeterminate(category)"
                                         @change="handlerCheckAll($event, category)"
                                         v-model="category.checkAll">
                                {{category.name}}
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="category.childIds">
                            <el-checkbox v-for="resource in category.child"
                                         :key="resource.id"
                                         :label="resource.id">{{resource.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-card>

                </div>
            </div>
            <div class="ops">
                <el-button @click="resetChecked">清空</el-button>
                <el-button type="primary"
                           @click="save">保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { allocateRoleResources, getRoleResources, getAllCategories, getAllResources } from '@/services/resource'
import { Tree } from 'element-ui'
export default Vue.extend({
    name: 'AllocResource',
    props: {
        roleId: {
            type: [String, Number],
            required: true
        }
    },
    data () {
        return {
            categories: [],
            loading: false
        }
    },
    created () {
        this.getData()
    },
    methods: {
        /**
         * @description 获取页面数据
         * @param {*}
         * @return {*}
         */
        getData () {
            this.loading = true
            Promise.all([this.getAllCategories(), this.getAllResources(), this.getCheckedResources()]).then(res => {
                const [allCategories, allResources, checkedResources] = res
                // 查询三个接口返回的数据是否有不正常的  code !== '000000'
                const index = res.findIndex(re => {
                    return re.data.code !== '000000'
                })
                // 如果有接口没有正常返回则报错提示
                if (index !== -1) {
                    this.$message({
                        type: 'error',
                        message: res[index].data.mesg
                    })
                    return
                }
                const categories = allCategories.data.data
                const checkedResource = checkedResources.data.data
                // 没有报错则处理数据
                categories.forEach((cate: any) => {
                    const categoryId = cate.id
                    const child = allResources.data.data.filter((resource: any) => resource.categoryId === categoryId)
                    cate.child = child
                    const resourceList = checkedResource.find((cr: any) => cr.id === cate.id).resourceList || []
                    cate.childIds = []
                    resourceList.forEach((rl: any) => {
                        if (rl.id && rl.selected) {
                            cate.childIds.push(rl.id)
                        }
                    })
                    const childLength = cate.child.length
                    cate.checkAll = childLength !== 0 && cate.childIds.length === childLength
                })
                this.categories = categories
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: err.message
                })
            }).finally(() => {
                this.loading = false
            })
        },
        /**
         * @description 查询所有的资源分类
         * @param {*}
         * @return {*}
         */
        getAllCategories () {
            return getAllCategories()
        },
        /**
         * @description 查询所有的资源
         * @param {*}
         * @return {*}
         */
        getAllResources () {
            return getAllResources()
        },
        /**
         * @description 获取已经选中的资源
         * @param {*}
         * @return {*}
         */
        getCheckedResources () {
            return getRoleResources(this.roleId)
        },
        /**
         * @description: 保存选中的资源
         * @param {*}
         * @return {*}
         */
        save () {
            // 拿到选中的资源
            let data = [] as any
            this.categories.forEach((cg: any) => {
                if (cg.selected) {
                    data.push(cg.id)
                }
                const ids = cg.childIds.map((ci: any) => ci)
                data = data.concat(ids)
            })
            allocateRoleResources({
                roleId: this.roleId,
                resourceIdList: data
            }).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.$message({
                        type: 'success',
                        message: data.mesg
                    })
                    this.$router.back()
                }
            })
        },
        /**
         * @description 重置表单
         * @param {*}
         * @return {*}
         */
        resetChecked () {
            (this.$refs.menuTree as Tree).setCheckedKeys([])
        },
        /**
         * @description 判断当前类别下是否全部选中
         * @param {Boolean} event 选中状态
         * @param {*} category 当前操作的分类
         * @return {*}
         */
        handlerCheckAll (event: boolean, category: any) {
            // 全选
            if (event) {
                category.childIds = category.child.map((cate: any) => cate.id)
            } else { // 全不选
                category.childIds = []
            }
        },
        /**
         * @description 判断当前分类的半选状态
         * @param {*} category
         * @return {Boolean} 返回判断结果
         */
        handlerIndeterminate (category: any) {
            const { childIds, child } = category
            if (childIds.length === 0) {
                return false
            } else if (childIds.length !== child.length) {
                return true
            }
        }
    }
})
</script>
<style lang="scss" scoped>
.alloc-resource {
    .ops {
        text-align: right;
    }
}
</style>