<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content: center;">
            <el-input
                    v-model="hrName"
                    style="width: 450px;margin-right: 15px;"
                    size="small"
                    placeholder="通过用户名搜索用户..."
                    prefix-icon="el-icon-search"
                    @keydown.native.enter="doSearch"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
            <el-button size="small" type="primary" icon="el-icon-edit" @click="dialogFormVisible=true">添加操作员</el-button>
        </div>
        <div class="hr-container">
            <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: #ff0023" type="text"
                               icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
                </div>
                <div>
                    <div class="userface-container">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                    </div>
                    <div class="userinfo-container">
                        <div>用户名：{{hr.name}}</div>
                        <div>手机号码：{{hr.phone}}</div>
                        <div>电话号码：{{hr.telephone}}</div>
                        <div>地址：{{hr.address}}</div>
                        <div>用户状态：
                            <el-switch
                                    v-model="hr.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    @change="enabledChange(hr)"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </div>
                        <div>用户角色：
                            <el-tag type="success" size="mini" style="margin-right: 5px;"
                                    v-for="(role,indexj) in hr.roles" :key="indexj">{{role.nameZh}}
                            </el-tag>
                            <el-popover
                                    placement="right"
                                    title="角色列表"
                                    @show="showPop(hr)"
                                    @hide="hidePop(hr)"
                                    width="200"
                                    trigger="click">
                                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                    <el-option
                                            v-for="(r,indexK) in allRoles"
                                            :key="indexK"
                                            :label="r.nameZh"
                                            :value="r.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                            </el-popover>
                        </div>
                        <div>备注：{{hr.remark}}</div>
                    </div>
                </div>
            </el-card>
            <el-dialog title="添加Hr" :visible.sync="dialogFormVisible" width="60%">
                <el-form :model="form">
                    <el-form-item label="Hr名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" :label-width="formLabelWidth">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" :label-width="formLabelWidth">
                        <el-input v-model="form.telephone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所住地址" :label-width="formLabelWidth">
                        <el-input v-model="form.address" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否生效" :label-width="formLabelWidth">
                        <el-switch
                                v-model="form.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949" style="margin-top: 2%">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="form.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="form.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.remark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addHr(form)">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                hrName: '',
                hrs: [],
                allRoles: [],
                selectedRoles: [],
                dialogFormVisible: false,
                form: {
                    name: '',
                    phone: '',
                    telephone: '',
                    address: '',
                    enabled: true,
                    username: '',
                    password: '',
                    userface: '',
                    remark:''
                },
                formLabelWidth: '120px'
            }
        },
        mounted() {
            this.initHrs();
        },
        methods: {
            // 删除管理员
            deleteHr(hr) {
                this.$confirm('此操作将永久删除【' + hr.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/" + hr.id).then(resp => {
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 搜索管理员
            doSearch() {
                this.initHrs();
            },
            addHr(form){
                this.postRequest("/system/hr/",form).then(resp=>{
                    console.log(resp.msg)
                    if (resp){
                        console.log("2222"+this.dialogFormVisible)
                        this.dialogFormVisible = false
                        this.initHrs()
                    }
                })
                console.log('添加操作员'+JSON.stringify(form))
            },
            // 修改用户角色
            hidePop(hr) {
                // 首先判断如果没有修改用户角色则不请求后台
                let roles = []; //拷贝后的用户角色数组
                Object.assign(roles, hr.roles); //将管理员的角色拷贝到 roles 数组中
                let flag = false;
                // 如果用户角色和当前选中的角色数组长度不一，则代表用户角色发生了改变，就去请求后台进行修改数据
                if (roles.length != this.selectedRoles.length) {
                    flag = true; // 为 true 则取请求后台
                } else {
                    // 二者长度不一 循环判断二者数据是否相同
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let sr = this.selectedRoles[j];
                            // 如果二者 id 相等
                            if (role.id == sr) {
                                roles.splice(i, 1); //移除用户所选择的角色
                                i--; //防止跳过数据判断
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true; // 为 true 则取请求后台
                    }
                }
                if (flag) {
                    // 组装请求路径
                    let url = '/system/hr/role?hrid=' + hr.id;
                    this.selectedRoles.forEach(sr => {
                        url += '&rids=' + sr;
                    });
                    this.putRequest(url).then(resp => {
                        this.initHrs();
                    });
                }
            },
            // 显示用户所具备的角色
            showPop(hr) {
                // 调用初始化角色方法
                this.initRoles();
                // 首先置空之前动态选中的用户角色
                this.selectedRoles = [];
                // 循环管理员所具备的角色 并让它选中（添加进数组即可）
                hr.roles.forEach(r => {
                    this.selectedRoles.push(r.id);
                })
            },
            // 修改管理员
            enabledChange(hr) {
                // 请求服务端接口时去掉 hr.roles 属性
                delete hr.roles;
                this.putRequest("/system/hr/", hr).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                })
            },
            // 初始化角色信息
            initRoles() {
                this.getRequest("/system/hr/roles").then(resp => {
                    if (resp) {
                        this.allRoles = resp;
                    }
                })
            },
            // 初始化管理员信息
            initHrs() {
                this.getRequest("/system/hr/?hrName=" + this.hrName).then(resp => {
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            }
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<style>
    .userinfo-container {
        font-size: 12px;
        color: #2b9fff;
    }

    .userface-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
    }

    .userface-img {
        height: 72px;
        width: 72px;
        border-radius: 72px;
    }

    .hr-container {
        display: flex;
        margin-top: 20px;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .hr-card {
        width: 350px;
        margin-bottom: 20px;
    }
</style>