<template>
    <div>
        <div>
            <el-input
                    size="small"
                    prefix-icon="el-icon-circle-plus"
                    placeholder="添加职称..."
                    style="width: 300px;"
                    @keydown.enter.native="addJobLevel"
                    v-model="jobLevel.name">
            </el-input>
            <el-select v-model="jobLevel.titleLevel" placeholder="职称等级" size="small"
                       style="margin-left: 8px;margin-right: 8px;">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addJobLevel">添加
            </el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" :disabled="this.multipleSelection.length == 0"
                       @click="deleteManyJobLevel">批量删除
            </el-button>
        </div>
        <div>
            <el-table
                    :data="jobLevels"
                    @selection-change="handleSelectionChange"
                    v-loading="loading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    border
                    stripe
                    height="450"
                    size="small"
                    style="width: 80%;margin-top: 10px;">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称等级"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="warning" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteJobLevel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                title="编辑职称"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职称名称</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="updatejobLevel.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称等级</el-tag>
                        </td>
                        <td>
                            <el-select v-model="updatejobLevel.titleLevel" size="small">
                                <el-option
                                        v-for="item in titleLevels"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch
                                    style="display: block"
                                    v-model="updatejobLevel.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="updateJobLevel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data() {
            return {
                jobLevel: {
                    name: '',
                    titleLevel: ''
                },
                updatejobLevel: {
                    name: '',
                    titleLevel: '',
                    enabled: false
                },
                titleLevels: ['正高级', '副高级', '中级', '初级', '员级'],
                jobLevels: [],
                dialogVisible: false,
                multipleSelection: [],
                loading: false
            }
        },
        mounted() {
            this.initJobLevel();
        },
        methods: {
            // 初始化职称信息
            initJobLevel() {
                this.loading = true;
                this.getRequest("/system/basic/jobLevel/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.jobLevels = resp;
                        this.jobLevel = {
                            name: '',
                            titleLevel: ''
                        };
                    }
                });
            },
            // 添加职称
            addJobLevel() {
                if (this.jobLevel.name && this.jobLevel.titleLevel) {
                    this.postRequest("/system/basic/jobLevel/", this.jobLevel).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    });
                } else {
                    this.$message.warning("添加字段不可以为空");
                }
            },
            // 显示编辑职称窗口
            showEditView(data) {
                Object.assign(this.updatejobLevel, data);
                this.dialogVisible = true;
            },
            // 修改职称
            updateJobLevel() {
                this.putRequest("/system/basic/jobLevel/", this.updatejobLevel).then(resp => {
                    if (resp) {
                        this.initJobLevel();
                        this.dialogVisible = false;
                    }
                });
            },
            // 删除职称
            deleteJobLevel(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 请求后端删除接口
                    this.deleteRequest("/system/basic/jobLevel/" + data.id).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 删除多条职称
            deleteManyJobLevel() {
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条职称信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除操作
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest("/system/basic/jobLevel/" + ids).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 选择表单项
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>

</style>