<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                :model="loginForm"
                v-loading="loading"
                element-loading-text="正在登陆..."
                element-loading-spinner="el-icon-loading"
                class="loginContainer">
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" v-model="loginForm.code" auto-complete="off"
                          placeholder="点击图片更换验证码" @keydown.enter.native="submitLogin" style="width: 250px;"></el-input>
                <img :src="vcUrl" @click="updateVerifyCode">
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember"></el-checkbox>
            <el-button type="primary" style="width:100%;" @click="submitLogin()">登陆</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                vcUrl: '/verifyCode?time=' + new Date(),
                loginForm: {
                    username: 'admin',
                    password: '123',
                    code: ''
                },
                loading: false,
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                }
            }
        },
        methods: {
            // 验证码更改事件
            updateVerifyCode() {
                this.vcUrl = '/verifyCode?time=' + new Date();
            },
            // 登陆事件
            submitLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true; // 登陆时显示加载进度
                        this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                            this.loading = false; // 登陆后关闭加载进度
                            // 如果后端返回数据则代表登陆成功
                            if (resp) {
                                this.$store.commit("INIT_CURRENTHR", resp.obj);
                                // 将用户数据存储到 sessionStorage
                                window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
                                // 拿到重定向后的页面路径
                                let path = this.$route.query.redirect;
                                // 如果 path 未定义或者来自登陆页面那就去 home 页，否则去 redirect 重定向后的页面
                                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                            } else {
                                // 登陆失败重新刷新验证码
                                this.vcUrl = '/verifyCode?time=' + new Date();
                                // 清空验证码输入框
                                this.loginForm.code = null;
                            }
                        });
                    } else {
                        this.$message.error('用户名、密码、验证码不能为空');
                        return false;
                    }
                })
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 15px #cac6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }

    .el-form-item__content{
        display: flex;
        align-items: center;
    }
</style>