<template>
    <div>
        <div>
            <el-input
                    placeholder="添加职位..."
                    prefix-icon="el-icon-circle-plus"
                    size="small"
                    style="width: 300px;margin-right: 8px;"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
            </el-input>
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addPosition">
                添加
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" :disabled="this.multipleSelection.length == 0"
                       @click="handleDeleteMany">
                批量删除
            </el-button>
        </div>
        <div>
            <el-table
                    :data="positions"
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
                        label="职位名称"
                        width="180">
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
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                title="编辑职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职位名称</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="updatePos.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch
                                    style="display: block"
                                    v-model="updatePos.enabled"
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
                <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                pos: {
                    name: ''
                },
                positions: [],
                multipleSelection: [],
                dialogVisible: false,
                updatePos: {
                    name: '',
                    enabled: false
                },
                loading: false
            }
        },
        mounted() {
            // 钩子函数 DOM 元素加载后调用此方法
            this.initPosition();
        },
        methods: {
            // 初始化职位信息
            initPosition() {
                this.loading = true;
                this.getRequest("/system/basic/pos/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        // 进行赋值表格数据
                        this.positions = resp;
                    }
                });
            },
            // 添加职位信息
            addPosition() {
                // 判断职位是否为空
                if (this.pos.name) {
                    // 请求后端添加接口
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            // 重新调用初始化职位信息方法
                            this.initPosition();
                            // 将数据框的数据清空
                            this.pos.name = '';
                        }
                    });
                } else {
                    // 为空则提示
                    this.$message.warning("职位名称不可以为空");
                }
            },
            // 显示编辑职位信息对话框
            showEditView(index, data) {
                Object.assign(this.updatePos, data);
                // 单击编辑按钮显示对话框
                this.dialogVisible = true;
            },
            // 编辑职位信息
            handleEdit() {
                // 请求后端更新接口
                this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                    if (resp) {
                        this.initPosition();
                        // 将 input 内容重置为空
                        this.updatePos.name = '';
                        // 将对话框关闭
                        this.dialogVisible = false;
                    }
                });
            },
            // 删除职位信息
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 请求后端删除接口
                    this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                        if (resp) {
                            this.initPosition();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 删除多条职位信息
            handleDeleteMany() {
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条职位信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 请求后端删除多条信息接口
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
                        if (resp) {
                            this.initPosition();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 选择表单项
            handleSelectionChange(val) {
                // 设置批量删除按钮生效
                this.multipleSelection = val;
            }
        }
    }
</script>

<style>
</style>