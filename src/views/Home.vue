<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">人事管理系统</div>
                <div>
                    <el-button type="text" icon="el-icon-bell" style="margin-right: 10px;color: #000000;" size="medium"
                               @click="goChat"></el-button>
                    <el-dropdown class="userInfo" @command="commandHandler">
                      <span class="el-dropdown-link">
                        {{user.name}}<i><img :src="user.userface" alt=""></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登陆</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i style="color: #2b9fff;margin-right: 5px;" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right"
                                   v-if="this.$router.currentRoute.path !='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path =='/home'">
                        欢迎来到人事管理系统！
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                // user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            },
            user() {
                return this.$store.state.currentHr;
            }
        },
        methods: {
            // 跳转聊天页面
            goChat() {
                this.$router.replace("/chat");
            },
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    // 去注销
                    this.$confirm('此操作将注销登陆, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 注销操作
                        this.getRequest("/logout");
                        // 清除用户数据
                        window.sessionStorage.removeItem("user");
                        this.$store.commit('initRoutes', []);
                        // 重定向至 Login
                        this.$router.replace('/');
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                } else if (cmd == 'userInfo') {
                    // 去个人中心
                    this.$router.replace("/hrinfo");
                }
            }
        }
    }
</script>

<style>
    .homeRouterView {
        margin-top: 10px;
    }

    .homeWelcome {
        text-align: center;
        font-size: 60px;
        font-family: 华文行楷;
        color: #b2e281;
        padding-top: 55px;
    }

    .homeHeader {
        background-color: #b2e281;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 华文楷体;
        color: #fdf8ff;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 15px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
</style>