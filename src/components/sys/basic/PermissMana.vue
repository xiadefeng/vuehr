<template>
    <div>
        <div class="permissInput">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名称"
                      v-model="role.nameZh" @keydown.enter.native="addRole"></el-input>
            <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" @click="addRole">添加</el-button>
        </div>
        <div style="margin-top: 10px;width: 70%;">
            <el-collapse accordion v-model="activeName" @change="change">
                <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0023;" type="text"
                                       icon="el-icon-delete" @click="deleteRole(role)"></el-button>
                        </div>
                        <div>
                            <el-tree
                                    node-key="id"
                                    ref="tree"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="menus" :props="defaultProps" show-checkbox></el-tree>
                            <div style="display: flex;justify-content: flex-end;">
                                <el-button size="small" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="small" type="primary" @click="doUpdate(role.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                menus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus: [],
                activeName: -1
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            // 删除角色
            deleteRole(role) {
                this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 请求后端删除接口
                    this.deleteRequest("/system/basic/permiss/role/" + role.id).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 添加角色
            addRole() {
                if (this.role.name && this.role.nameZh) {
                    this.postRequest("/system/basic/permiss/role", this.role).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    });
                } else {
                    this.$message.warning("添加字段不可以为空");
                }
            },
            // 取消修改权限组
            cancelUpdate() {
                // 将选项卡隐藏
                this.activeName = -1;
            },
            // 修改角色权限
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);
                let url = '/system/basic/permiss/?rid=' + rid;
                selectedKeys.forEach(key => {
                    url += '&mids=' + key;
                });
                this.putRequest(url).then(resp => {
                    if (resp) {
                        // 将选项卡隐藏
                        this.activeName = -1;
                    }
                });
            },
            // 加载角色
            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                        this.role = {
                            name: '',
                            nameZh: ''
                        }
                    }
                });
            },
            // 加载菜单
            initMenus() {
                this.getRequest("/system/basic/permiss/menus").then(resp => {
                    if (resp) {
                        this.menus = resp;
                    }
                })
            },
            // 树状菜单改变事件
            change(rid) {
                if (rid) {
                    this.initMenus();
                    this.initSelectedMenus(rid);
                }
            },
            // 跟据角色编号拿到角色有权限的菜单
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
                    if (resp) {
                        // 将结果渲染至树状菜单中
                        this.selectedMenus = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .permissInput .el-input {
        width: 300px;
        margin-right: 10px;
    }
</style>