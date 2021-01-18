<template>
    <div class="course-section"
         v-loading="loading">
        <el-card>
            <div slot="header"
                 class="header">
                <header-wrap isAllowBack
                             :title="courseName"></header-wrap>
                <div class="actions">
                    <el-button type="primary"
                               @click="addStage">添加阶段</el-button>
                </div>
            </div>
            <el-tree :data="sections"
                     draggable
                     @node-drop="drop"
                     :allow-drop="handleAllowDrop"
                     :props="defaultProps">
                <div class="inner"
                     slot-scope="{node, data}">
                    <span>{{node.label}}</span>
                    <!-- section -->
                    <span class="actions">
                        <el-button v-show="data.sectionName"
                                   @click.stop="edit(data)">编辑</el-button>
                        <el-button v-show="!data.sectionName"
                                   @click.stop="editLesson(data)">编辑</el-button>
                        <el-button v-show="data.sectionName"
                                   @click.stop="addLesson(data)"
                                   type="primary">添加课时</el-button>
                        <el-button @click="uploadVideo(data, node)" v-show="!data.sectionName">上传视频</el-button>
                        <el-select v-model="data.status"
                                   @change="changeStatus(data)"
                                   class="statusSelect">
                            <el-option v-for="state in states"
                                       :key="state.value"
                                       :label="state.name"
                                       :value="state.value"></el-option>
                        </el-select>
                    </span>
                </div>
            </el-tree>
        </el-card>
        <edit-dialog :title="title"
                     :data="form"
                     @update="getData"
                     :courseName="courseName"
                     :visiable.sync="show.editSection"></edit-dialog>
        <add-lesson :title="'课时基本信息'"
                    :data="lesson"
                    :courseName="courseName"
                    @update="getData"
                    :visiable.sync="show.addLesson"></add-lesson>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditDialog from './components/editDialog.vue'
import AddLesson from './components/lessonDialog.vue'
import HeaderWrap from '@/components/header-wrap/index.vue'
import { getSectionAndLesson, saveOrUpdate, saveOrUpdateSection } from '@/services/course-section'
export default Vue.extend({
    name: 'CourseSection',
    props: {
        courseId: {
            type: [String, Number],
            required: true
        },
        courseName: {
            type: String,
            default: ''
        }
    },
    components: {
        EditDialog,
        AddLesson,
        HeaderWrap
    },
    data () {
        return {
            sections: [],
            defaultProps: {
                children: 'lessonDTOS',
                label (data: any) {
                    return data.sectionName || data.theme
                }
            },
            loading: false,
            title: '章节信息',
            form: {},
            states: [
                {
                    name: '已隐藏',
                    value: 0
                },
                {
                    name: '待更新',
                    value: 1
                },
                {
                    name: '已更新',
                    value: 2
                }
            ],
            show: {
                editSection: false,
                addLesson: false
            },
            lesson: {}
        }
    },
    created () {
        this.getData()
    },
    methods: {
        handleNodeClick (data: any) {
            console.log(data)
        },
        /**
         * @description 加载页面数据
         * @param {*}
         * @return {*}
         */
        getData () {
            this.loading = true
            getSectionAndLesson(this.courseId).then((res: any) => {
                const { data } = res
                if (data.code === '000000') {
                    this.sections = data.data
                } else {
                    this.$message.error(data.mesg)
                }
                this.loading = false
            }).catch((err: any) => {
                this.loading = false
                this.$message.error(err.mesg)
            })
        },
        /**
         * @description 编辑
         * @param {*} data
         * @return {*}
         */
        edit (data: any) {
            this.form = data
            this.show.editSection = true
        },
        /**
         * @description 修改状态
         * @param {*}
         * @return {*}
         */
        changeStatus (data: any) {
            let fn = null
            if (data.sectionName) {
                fn = saveOrUpdateSection
            } else {
                fn = saveOrUpdate
            }
            fn({
                id: data.id,
                status: data.status + '',
                data
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
        /**
         * @description 添加阶段
         * @param {*}
         * @return {*}
         */
        addStage () {
            this.form = {
                courseId: this.courseId,
                courseName: this.courseName,
                description: '',
                orderNum: '',
                sectionName: ''
            }
            this.show.editSection = true
        },
        /**
         * @description 添加课时
         * @param {Object} data
         * @return {*}
         */
        addLesson (data: any) {
            const { courseId, status, id: sectionId, sectionName } = data
            this.lesson = {
                courseId,
                courseName: this.courseName,
                status,
                sectionId,
                sectionName,
                duration: '',
                isFree: false,
                orderNum: '',
                theme: ''
            }
            this.show.addLesson = true
        },
        /**
         * @description 编辑课时
         * @param {*} data
         * @return {*}
         */
        editLesson (data: any) {
            Object.assign(data, {
                sectionName: data.theme,
                courseName: this.courseName
            })
            this.lesson = data
            this.show.addLesson = true
        },
        /**
         * @description 判断节点是否可以被放置
         * @param {Object} draggingNode 正在拖拽得节点
         * @param {Object} dropNode 放置得目标节点
         * @param {String} type 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
         * @return {*}
         */
        handleAllowDrop (draggingNode: any, dropNode: any, type: string) {
            return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
        },
        /**
         * @description: 拖拽结束得回调事件
         * @param {Object} dragNode 拖拽得节点
         * @param {Object} dropNode 放置得目标节点
         * @param {String } type 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
         * @param {Object} event 拖拽事件
         * @return {*}
         */
        drop (dragNode: any, dropNode: any) {
            // 如果是阶段
            Promise.all([dropNode.parent.childNodes.map((item: any, index: number) => {
                // 阶段
                console.log(item)
                if (dragNode.data.lessonDTOS) {
                    return saveOrUpdateSection({
                        id: item.data.id,
                        orderNum: index + 1
                    })
                } else { // 课时
                    return saveOrUpdate({
                        id: item.data.id,
                        orderNum: index + 1
                    })
                }
            })]).then(() => {
                console.log('排序成功')
                this.$message({
                    type: 'success',
                    message: '排序成功'
                })
            }).catch(() => {
                console.log('排序失败')
                this.$message({
                    type: 'error',
                    message: '排序失败'
                })
            }).finally(() => {
                this.getData()
            })
        },
        /**
         * @description 跳转上传课时页面
         * @param {Object} data 当前行数据
         * @return {*}
         */
        uploadVideo (data: any, node: any) {
            this.$router.push({
                name: 'course-video',
                query: {
                    courseName: this.courseName,
                    theme: data.theme,
                    courseId: this.courseId.toString(),
                    sectionId: node.parent.id,
                    lessonId: data.id
                }
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.course-section {
    .statusSelect {
        width: 100px;
        margin-left: 10px;
    }
    ::v-deep .el-tree-node__content {
        height: auto;
        padding: 10px;
    }
    .inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
    }
    .el-card__header {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
}
</style>