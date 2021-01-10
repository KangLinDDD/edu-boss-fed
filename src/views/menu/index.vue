<template>
    <div class="menu">
        <el-card class="box-card">
            <div slot="header"
                 class="clearfix">
                <el-button type="default"
                           @click="addMenu">添加菜单</el-button>
            </div>
            <el-table :data="menus"
                      style="width: 100%">
                <el-table-column label="编号"
                                 min-width="150"
                                 type="index">
                </el-table-column>
                <el-table-column prop="name"
                                 label="菜单名称"
                                 min-width="150">
                </el-table-column>
                <el-table-column prop="level"
                                 label="菜单级数"
                                 min-width="150">
                </el-table-column>
                <el-table-column prop="icon"
                                 label="前端图标"
                                 min-width="150">
                </el-table-column>
                <el-table-column prop="orderNum"
                                 label="排序"
                                 min-width="150">
                </el-table-column>
                <el-table-column label="操作"
                                 min-width="150">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini"
                                   type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'
interface Row {
    createdBy: string
    createdTime: string
    description: string
    href: string
    icon: string
    id: number
    level: number
    name: string
    operatorId: number | null
    orderNum: number
    parentId: number
    shown: boolean
    updatedBy: string
    updatedTime: string
}
export default Vue.extend({
    name: 'Menu',
    data () {
        return {
            menus: []
        }
    },
    created () {
        this.getAllMenus()
    },
    methods: {
        addMenu () {
            this.$router.push({
                name: 'menu-create'
            })
        },
        getAllMenus () {
            getAllMenus().then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.menus = data.data
                } else {
                    this.menus = []
                }
            })
        },
        /**
         * @description 编辑
         * @param {Object} row 当前行数据
         */
        handleEdit (row: any) {
            this.$router.push({
                name: 'menu-edit',
                query: {
                    id: row.id
                }
            })
        },
        /**
         * @description 删除
         * @param {Object} row 当前行数据
         * @param {Number} index 当前行索引
         * @return {*}
         */
        handleDelete (index: number, row: Row) {
            this.$confirm('确认删除吗？', '删除提示').then(() => {
                // 删除
                deleteMenu(row.id).then((res: any) => {
                    const { data } = res
                    if (data.code === '000000') {
                        this.$message.success('删除成功')
                        this.menus.splice(index, 1)
                    }
                })
            })
        }
    }
})
</script>

<style lang="scss" scoped>
</style>
