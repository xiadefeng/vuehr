<template>
    <div style="width: 500px;">
        <el-input
                placeholder="请输入部门名称进行搜索..."
                prefix-icon="el-icon-search"
                size="small"
                v-model="filterText">
        </el-input>
        <el-tree
                style="margin-top: 10px;"
                :data="deps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                ref="tree">
            <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
                  slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
                  type="primary"
                  class="depBtn"
                  size="mini"
                  @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
                  type="danger"
                  size="mini"
                  class="depBtn"
                  @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>{{parentName}}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="dep.name" placeholder="请输入部门名称..."
                                      @keydown.enter.native="addDepartment"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="addDepartment">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                dialogVisible: false,
                filterText: '',
                deps: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dep: {
                    name: '',
                    parentId: -1
                },
                parentName: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            // 递归展示删除后的部门
            removeDepFromDeps(p, deps, id) {
                //循环所有部门进行移除操作
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    // 如果所有部门中有一个部门编号和你要删除的编号相等
                    if (d.id == id) {
                        // 那么就进行数组移除操作，一次移除一位
                        deps.splice(i, 1);
                        // 移除后进行判断 如果当前部门下没有子部门
                        if (deps.length == 0) {
                            // 那么就修改其属性将其改为非父部门 （也就是子部门）
                            p.parent = false;
                        }
                        return;
                    } else {
                        this.removeDepFromDeps(d, d.children, id);
                    }
                }
            },
            // 删除部门
            deleteDep(data) {
                if (data.parent) {
                    this.$message.warning("该部门下存在子部门，不能删除！");
                } else {
                    this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
                            if (resp) {
                                // 调用动态移除部门项 （不刷新页面）
                                this.removeDepFromDeps(null, this.deps, data.id);
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            // 初始化变量
            initDep() {
                this.dep = {
                    name: '',
                    parentId: -1
                };
                this.parentName = '';
            },
            // 显示添加部门视图
            showAddDepView(data) {
                this.parentName = data.name; // 上级部门名称
                this.dep.parentId = data.id; // 上级部门 id
                this.dialogVisible = true;
            },
            // 递归展示添加过的部门
            addDep2Deps(deps, dep) {
                //循环所有部门进行添加操作
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    // 如果所有部门中有一个部门编号和你要添加的编号相等
                    if (d.id == dep.parentId) {
                        // 那么就进行数组拼接操作
                        d.children = d.children.concat(dep);
                        // 添加后进行判断 如果此部门添加了子部门
                        if (d.children.length > 0) {
                            // 那么就修改其属性将其改为父部门 （有子部门了就证明当前部门是父部门）
                            d.parent = true;
                        }
                        return;
                    } else {
                        // 递归判断
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            // 添加部门
            addDepartment() {
                this.postRequest("/system/basic/department/", this.dep).then(resp => {
                    if (resp) {
                        // 动态添加部门（不刷新页面）
                        this.addDep2Deps(this.deps, resp.obj);
                        this.dialogVisible = false;
                        // 初始化变量
                        this.initDep();
                    }
                })
            },
            // 加载所有部门
            initDeps() {
                this.getRequest("/system/basic/department/").then(resp => {
                    if (resp) {
                        this.deps = resp;
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
    }
</script>

<style>
    .depBtn {
        padding: 2px;
    }
</style>