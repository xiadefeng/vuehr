<template>
    <div>
        <div style="margin-top: 10px;">
            <el-table
                    :data="emps"
                    size="mini"
                    border
                    v-loading="loading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    stripe>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120" fixed align="left"></el-table-column>
                <el-table-column prop="workID" label="工号" width="120" align="left"></el-table-column>
                <el-table-column prop="email" label="电子邮件" width="200" align="left"></el-table-column>
                <el-table-column prop="phone" label="电话号码" width="120" align="left"></el-table-column>
                <el-table-column prop="department.name" label="所属部门" width="120" align="left"></el-table-column>
                <el-table-column label="工资账套" align="center">
                    <template slot-scope="scope">
                        <el-tooltip placement="right" v-if="scope.row.salary">
                            <div slot="content">
                                <table>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">基本工资</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.basicSalary}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">交通补助</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.trafficSalary}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">午餐补助</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.lunchSalary}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">奖金</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.bonus}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">养老金比率</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.pensionPer}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">养老金基数</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.pensionBase}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">医疗保险比率</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.medicalPer}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">医疗保险基数</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.medicalBase}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">公积金比率</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.accumulationFundPer}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">公积金基数</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.accumulationFundBase}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <el-tag size="mini" effect="dark">启用时间</el-tag>
                                        </td>
                                        <td>{{scope.row.salary.createDate}}</td>
                                    </tr>
                                </table>
                            </div>
                            <el-tag>{{scope.row.salary.name}}</el-tag>
                        </el-tooltip>
                        <el-tag size="mini" effect="dark" v-else>暂未设置</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                width="200"
                                @show="showPop(scope.row.salary)"
                                @hide="hidePop(scope.row)"
                                trigger="click">
                            <div>
                                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in salaries"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button slot="reference" icon="el-icon-update" size="mini" type="danger">修改账套</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
            <el-pagination
                    background
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    layout="sizes, prev, pager, next, jumper, ->, total, slot"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSobCfg",
        data() {
            return {
                currentSalary: null,
                total: 0,
                currentPage: 1,
                currentSize: 10,
                loading: false,
                emps: [],
                salaries: []
            }
        },
        mounted() {
            this.initEmps();
            this.initSalaries();
        },
        methods: {
            // 员工账套选项隐藏则去修改它
            // data：员工数据
            hidePop(data) {
                // 如果员工账套为空则不修改
                if (this.currentSalary) {
                    this.putRequest("/salary/sobcfg/?eid=" + data.id + "&sid=" + this.currentSalary).then(resp => {
                        if (resp) {
                            this.initEmps();
                        }
                    })
                }
            },
            // 显示出要修改的员工账套选项并选中
            // salary 员工薪资数据
            showPop(data) {
                if (data) {
                    this.currentSalary = data.id;
                } else {
                    this.currentSalary = null;
                }
            },
            // 加载薪资账套
            initSalaries() {
                this.getRequest("/salary/sobcfg/salaries").then(resp => {
                    if (resp) {
                        this.salaries = resp;
                    }
                })
            },
            // 分页数量改变事件
            sizeChange(size) {
                this.currentSize = size;
                this.initEmps();
            },
            // 当前页码改变事件
            currentChange(page) {
                this.currentPage = page;
                this.initEmps();
            },
            // 加载员工账套
            initEmps() {
                this.loading = true;
                this.getRequest("/salary/sobcfg/?page=" + this.currentPage + "&size=" + this.currentSize).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.emps = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>