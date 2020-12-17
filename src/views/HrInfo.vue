<template>
    <div>
        <div>
            <el-card class="box-card" style="width: 400px;">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                </div>
                <div>
                    <div style="display: flex;justify-content: center;margin-bottom: 10px;">
                        <el-upload
                                :on-success="onSuccess"
                                :show-file-list="false"
                                :data="hr"
                                action="/hr/userface">
                            <img title="点击修改用户头像" :src="hr.userface" alt=""
                                 style="width: 75px;height: 75px;border-radius: 75px;">
                        </el-upload>

                    </div>
                    <div>手机号码：
                        <el-tag size="mini">{{hr.telephone}}</el-tag>
                    </div>
                    <div>电话号码：
                        <el-tag size="mini">{{hr.phone}}</el-tag>
                    </div>
                    <div>居住地址：
                        <el-tag size="mini">{{hr.address}}</el-tag>
                    </div>
                    <div>用户角色：
                        <el-tag size="mini" type="success" style="margin-right: 5px;" v-for="(role,index) in hr.roles"
                                :key="index">{{role.nameZh}}
                        </el-tag>
                    </div>
                    <div style="display: flex;justify-content:space-around;margin-top: 10px;">
                        <el-button size="mini" type="primary" @click="showEditHrInfoView">修改信息</el-button>
                        <el-button size="mini" type="danger" @click="showEditPasswdView">修改密码</el-button>
                    </div>
                </div>
            </el-card>
            <el-dialog
                    title="修改个人信息"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag>用户昵称</el-tag>
                            </td>
                            <td>
                                <el-input v-model="upHr.name"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>电话号码</el-tag>
                            </td>
                            <td>
                                <el-input v-model="upHr.telephone"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>手机号码</el-tag>
                            </td>
                            <td>
                                <el-input v-model="upHr.phone"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>联系地址</el-tag>
                            </td>
                            <td>
                                <el-input v-model="upHr.address"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="updateHr">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                    title="修改密码"
                    :visible.sync="passwdDialogVisible"
                    width="30%">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="请输入旧密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入新密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HrInfo",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                hr: {},
                upHr: {},
                dialogVisible: false,
                passwdDialogVisible: false,
                ruleForm: {
                    oldpass: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    oldpass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.initHr();
        },
        methods: {
            // 修改用户头像
            onSuccess() {
                this.initHr();
            },
            // 修改密码
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.hrid = this.hr.id;
                        this.putRequest("/hr/pass", this.ruleForm).then(resp => {
                            if (resp) {
                                // 密码修改成功然后注销
                                this.getRequest("/logout");
                                // 移除会话中的用户数据
                                window.sessionStorage.removeItem("user");
                                // 重置用户的角色
                                this.$store.commit("initRoutes", []);
                                // 跳转至登陆页面
                                this.$router.replace("/");
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 重置密码
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 显示修改密码视图
            showEditPasswdView() {
                this.passwdDialogVisible = true;
            },
            // 修改个人信息
            updateHr() {
                this.putRequest("/hr/info", this.upHr).then(resp => {
                    if (resp) {
                        this.initHr();
                        this.dialogVisible = false;
                    }
                })
            },
            // 显示修改个人信息视图
            showEditHrInfoView() {
                this.dialogVisible = true;
            },
            // 加载登陆用户信息
            initHr() {
                this.getRequest("/hr/info").then(resp => {
                    if (resp) {
                        this.hr = resp;
                        this.upHr = Object.assign({}, this.hr);
                        window.sessionStorage.setItem("user", JSON.stringify(resp));
                        this.$store.commit("INIT_CURRENTHR", resp);
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>