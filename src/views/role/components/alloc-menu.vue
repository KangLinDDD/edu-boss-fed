<template>
    <div class="alloc-menu">
        <el-card>
            <div slot="header">
                <span>分配菜单</span>
                <el-tree :data="treeNodes"
                         show-checkbox
                         :default-checked-keys="checkedKeys"
                         ref="menuTree"
                         node-key="id"
                         default-expand-all
                         :props="defaultProps"></el-tree>
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
import { getMenuNodeList, allocateRoleMenus, getRolesMenus } from '@/services/menu'
import { Tree } from 'element-ui'
export default Vue.extend({
    name: 'AllocMenu',
    props: {
        roleId: {
            type: [String, Number],
            required: true
        }
    },
    data () {
        return {
            treeNodes: [],
            defaultProps: {
                children: 'subMenuList',
                label: 'name'
            },
            checkedKeys: []
        }
    },
    created () {
        this.getMenuNodeList()
        this.getCheckedMenus()
    },
    methods: {
        getMenuNodeList () {
            getMenuNodeList().then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.treeNodes = data.data
                }
            })
        },
        getCheckedMenus () {
            getRolesMenus(this.roleId).then(res => {
                const { data } = res
                if (data.code === '000000') {
                    this.checkedKeys = this.getCheckedKeys(data.data) as any
                    return
                }
                this.$message({
                    type: 'error',
                    message: data.mesg
                })
            })
        },
        getCheckedKeys (data: Array<any>): Array<number> {
            const arr = [] as Array<number>
            data.forEach((node: any) => {
                if (node.selected) {
                    arr.push(node.id as number)
                }
                if (node.subMenuList && node.subMenuList.length !== 0) {
                    arr.concat(this.getCheckedKeys(node.subMenuList) as Array<number>)
                }
            })
            return arr
        },
        save () {
            // 拿到选中节点的数据
            const data: Array<number | string> = (this.$refs.menuTree as Tree).getCheckedKeys()
            allocateRoleMenus({
                roleId: this.roleId,
                menuIdList: data
            }).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.$message({
                        type: 'success',
                        message: data.mesg
                    })
                }
            })
        },
        resetChecked () {
            (this.$refs.menuTree as Tree).setCheckedKeys([])
        }
    }
})
</script>
<style lang="scss" scoped>
.alloc-menu {
    .ops {
        text-align: right;
    }
}
</style>