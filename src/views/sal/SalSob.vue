<template>
    <div>
        <div style="display: flex;justify-content: space-between;">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="showAddSalaryView">添加账套</el-button>
            <el-button size="mini" type="success" icon="el-icon-refresh" @click="initSalarys"></el-button>
        </div>
        <div style="margin-top: 10px;">
            <div style="margin-top: 10px">
                <el-table
                        :data="salarys"
                        border
                        stripe
                        @selection-change="handleSelectionChange"
                        v-loading="loading"
                        element-loading-text="重新加载中..."
                        element-loading-spinner="el-icon-loading"
                        size="mini">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
                    <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
                    <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
                    <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
                    <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
                    <el-table-column width="100" prop="createDate" label="启用时间"></el-table-column>
                    <el-table-column label="养老金" align="center">
                        <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
                        <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
                    </el-table-column>
                    <el-table-column label="医疗保险" align="center">
                        <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
                        <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
                    </el-table-column>
                    <el-table-column label="公积金" align="center">
                        <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
                        <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showEditSalaryView(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="deleteSalary(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                           :disabled="this.multipleSelection.length == 0"
                           @click="deleteManySalary"
                           style="margin-top: 10px;border-radius: 10px;">批量删除
                </el-button>
            </div>
        </div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="50%">
            <div style="display: flex;justify-content: space-around;align-items: center">
                <el-steps direction="vertical" :active="activeItemIndex">
                    <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
                </el-steps>
                <el-input v-model="salary[title]" :placeholder="'请输入' + salaryItemName[index] +'...'"
                          v-for="(value,title,index) in salary"
                          :key="index" v-show="activeItemIndex==index" style="width: 200px;"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="cancelAdd">取消</el-button>
    <el-button size="mini" @click="preStep">上一步</el-button>
    <el-button size="mini" type="primary" @click="nextStep">{{activeItemIndex==10?'完成':'下一步'}}</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                loading: false,
                dialogVisible: false,
                dialogTitle: '',
                activeItemIndex: 0,
                salarys: [],
                multipleSelection: [],
                salaryItemName: [
                    '基本工资',
                    '交通补助',
                    '午餐补助',
                    '奖金',
                    '养老金比率(百分比)',
                    '要老金基数',
                    '医疗保险比率(百分比)',
                    '医疗保险基数',
                    '公积金比率(百分比)',
                    '公积金基数',
                    '账套名称'
                ],
                salary: {
                    basicSalary: 0,
                    trafficSalary: 0,
                    lunchSalary: 0,
                    bonus: 0,
                    pensionPer: 0,
                    pensionBase: 0,
                    medicalPer: 0,
                    medicalBase: 0,
                    accumulationFundPer: 0,
                    accumulationFundBase: 0,
                    name: ''
                }
            }
        },
        mounted() {
            this.initSalarys();
        },
        methods: {
            // 显示修改工资账套视图
            showEditSalaryView(data) {
                this.dialogTitle = '修改工资账套';
                this.dialogVisible = true;
                this.salary.basicSalary = data.basicSalary;
                this.salary.trafficSalary = data.trafficSalary;
                this.salary.lunchSalary = data.lunchSalary;
                this.salary.bonus = data.bonus;
                this.salary.pensionPer = data.pensionPer;
                this.salary.pensionBase = data.pensionBase;
                this.salary.medicalPer = data.medicalPer;
                this.salary.medicalBase = data.medicalBase;
                this.salary.accumulationFundPer = data.accumulationFundPer;
                this.salary.accumulationFundBase = data.accumulationFundBase;
                this.salary.name = data.name;
                this.salary.id = data.id;
            },
            // 删除工资账套
            deleteSalary(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】账套, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/sob/" + data.id).then(resp => {
                        if (resp) {
                            this.initSalarys();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 删除多条工资账套
            deleteManySalary() {
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条账套信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 请求后端删除多条信息接口
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest("/salary/sob/" + ids).then(resp => {
                        if (resp) {
                            this.initSalarys();
                        }
                    });
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 置空数据
            emptyData() {
                this.salary = {
                    basicSalary: 0,
                    trafficSalary: 0,
                    lunchSalary: 0,
                    bonus: 0,
                    pensionPer: 0,
                    pensionBase: 0,
                    medicalPer: 0,
                    medicalBase: 0,
                    accumulationFundPer: 0,
                    accumulationFundBase: 0,
                    name: ''
                };
                this.activeItemIndex = 0;
            },
            // 取消添加工资账套
            cancelAdd() {
                // 置空数据
                this.emptyData();
                // 关闭对话框
                this.dialogVisible = false;
            },
            // 添加工资账套上一步选择方法
            preStep() {
                // 如果上一步回到第一选项直接结束
                if (this.activeItemIndex == 0) {
                    return;
                } else if (this.activeItemIndex == 10) {
                    this.activeItemIndex--;
                    return;
                }
                this.activeItemIndex--;
            },
            // 添加工资账套下一步选择方法
            nextStep() {
                // 判断如果所有添加选项选择完成后结束
                if (this.activeItemIndex == 10) {
                    if (this.salary.id) {
                        // 修改操作
                        this.putRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                // 首先刷新页面数据
                                this.initSalarys();
                                // 重置数据
                                this.emptyData();
                                // 关闭对话框
                                this.dialogVisible = false;
                            }
                        });
                    } else {
                        // 新增操作
                        this.postRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                // 首先刷新页面数据
                                this.initSalarys();
                                // 重置数据
                                this.emptyData();
                                // 关闭对话框
                                this.dialogVisible = false;
                            }
                        });
                    }
                    return;
                }
                this.activeItemIndex++;
            },
            // 显示添加工资账套视图
            showAddSalaryView() {
                this.dialogTitle = '添加工资账套';
                this.dialogVisible = true;
            },
            // 初始化工资账套
            initSalarys() {
                this.loading = true;
                this.getRequest("/salary/sob/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.salarys = resp;
                    }
                })
            },
            // 选择表单项
            handleSelectionChange(val) {
                // 设置批量删除按钮生效
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>

</style>