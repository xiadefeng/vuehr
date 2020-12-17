
<style scoped>

    #app > div > section > section > main > div.homeRouterView > div:nth-child(3) > div > div > div.el-dialog__body > div > form > div:nth-child(2) > div{
        width: 109px;
    }

</style>
<template>
    <div>
        <div>
            <el-input
                    style="width: 350px;margin-right: 15px;"
                    placeholder="通过员工姓名搜索员工调动记录，可以直接回车搜索..."
                    size="small"
                    v-model="keyword"
                    clearable
                    @clear="initEmpMv"
                    :disabled="showAdvanceSearchView"
                    @keydown.native.enter="initEmpMv"
                    prefix-icon="el-icon-search"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="initEmpMv"
                       :disabled="showAdvanceSearchView">搜索
            </el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addEmpMv" style="float: right;margin-bottom: 20px">添加员工调动信息</el-button>
        </div>
        <div>
            <el-table
                    :data="empMv"
                    stripe
                    v-loading="loading"
                    element-loading-text="正在加载数据..."
                    element-loading-spinner="el-icon-loading"
                    border
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="employeeNameDto.name"
                        label="员工姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="departmentDto.depName"
                        label="调动后的部门"
                        width="170">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="positionDto.posName"
                        label="调动后职位"
                        width="250">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="removedate"
                        label="调动日期"
                        width="210">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="reason"
                        label="调动原因"
                        width="320">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="remark"
                        label="备注"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
<!--                        <el-button-->
<!--                                size="mini"-->
<!--                                type="danger"-->
<!--                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div>
            <el-dialog
                    :title="dialogTitle"
                    :visible.sync="dialogVisible"
                    width="50%">
                <div>
                    <el-form :rules="rules" ref="empMvForm"  :model="empMvForm" label-width="80px">
                        <el-form-item label="员工姓名" prop="eid">
                            <el-select v-model="empMvForm.eid" placeholder="请选择员工名称" @click.native="chooseEmp" :disabled="flags">
                                <el-option v-for="item in empNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="调动部门" prop="afterdepid" >
                            <el-select v-model="empMvForm.afterdepid" placeholder="请选择调动后的部门" @click.native="chooseDept" >
                                <el-option v-for="item in depNames" :key="item.id" :label="item.depName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="调动职位" prop="afterjobid">
                            <el-select v-model="empMvForm.afterjobid" placeholder="请选择调动后的职位" @click.native="chooseJob" >
                                <el-option v-for="item in jobNames" :key="item.id" :label="item.posName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="调动日期" prop="removedate">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="empMvForm.removedate"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false" style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="调动原因"  prop="reason">
                            <el-input type="textarea" v-model="empMvForm.reason" placeholder="请输入调动原因"></el-input>
                        </el-form-item>
                        <el-form-item label="备注"  prop="remark">
                            <el-input type="textarea" v-model="empMvForm.remark" placeholder="备注信息"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddEmpMv">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpMv",
        data() {
            return {
                empMv:[],
                showAdvanceSearchView: false,
                keyword: '',
                flags:false,
                radio: '0',
                dialogTitle: '',
                total: 0,
                page: 1,
                size: 10,
                loading: false,
                jobNames:[{
                    id:'',
                    posName:''
                }],
                empNames:[{
                    id:'',
                    name:''
                }],
                depNames:[{
                    id:'',
                    depName:''
                }],
                dialogVisible: false,
                empMvForm: {
                    eid:'',
                    afterdepid: '',
                    afterjobid: '',
                    removedate: '',
                    reason: '',
                    remark: '',
                },
                rules: {
                    eid:[{required: true, message: '请选择员工', trigger: 'blur'}],
                    afterdepid:[{required: true, message: '请选择员工', trigger: 'blur'}],
                    afterjobid:[{required: true, message: '请选择员工', trigger: 'blur'}],
                    removedate:[{required: true, message: '请选择调动日期', trigger: 'blur'}],
                    reason:[{required: true, message: '请输入调动原因', trigger: 'blur'}],
                    remark: [{required: true, message: '请输入调动备注', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initEmpMv();
            //this.initData();
            //this.initPositions();
        },
        methods: {
            initEmpMv() {
                this.loading = true;
                let url = '/employeemv/basic/?page=' + this.page + "&size=" + this.size;
                // 普通搜索
                // 如果姓名关键字不为空则添加上条件
                if (this.keyword) {
                    url += '&employeeNameDto.name=' + this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.empMv = resp.data;
                        this.total = resp.total;
                    }
                });
                console.log('000')
            },
            handleEdit(index, row) {
                this.dialogTitle = '修改员工调动信息';
                this.dialogVisible = true,
                this.empMvForm = row;
                this.empMvForm.eid = row.employeeNameDto.name
                this.empMvForm.afterdepid = row.departmentDto.depName
                this.empMvForm.afterjobid = row.positionDto.posName
                this.flags = true
                console.log(row);
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除【' + row.employeeNameDto.name + '】员工的调动信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employeemv/basic/" + row.id).then(resp => {
                        if (resp) {
                            this.initEmpMv();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initEmpMv();
            },
            // 每页条数改变事件
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initEmpMv();
            },
            addEmpMv() {
                this.emptyEmpec();
                this.dialogTitle = '添加员工调动信息';
                this.dialogVisible = true;
                this.flags = false
            },
            onSubmit() {
                console.log('submit!');
            },
            emptyEmpec() {
                this.empMvForm = {
                    eid:'',
                    afterdepid: '',
                    afterjobid: '',
                    removedate: '',
                    reason: '',
                    remark: '',
                };
            },
            //下拉选择员工
            chooseEmp() {
                this.getRequest("/employee/basic/names").then(resp => {
                    if (resp) {
                        this.empNames = resp
                    }
                })
            },
            //下拉选择部门
            chooseDept(){
                this.getRequest("/system/basic/department/names").then(resp => {
                    if (resp) {
                        this.depNames = resp
                    }
                })
            },
            chooseJob(){
                this.getRequest("/system/basic/pos/names").then(resp => {
                    if (resp) {
                        this.jobNames = resp
                    }
                })
            },
            doAddEmpMv() {
                // 如果员工id存在则是修改
                if (this.empMvForm.id) {
                    this.$refs.empMvForm.validate(valid => {
                        if (valid) {
                            this.empMvForm.eid = this.empMvForm.employeeNameDto.id
                            this.empMvForm.afterdepid = this.empMvForm.departmentDto.id
                            this.empMvForm.afterjobid = this.empMvForm.positionDto.id
                            this.putRequest("/employeemv/basic/", this.empMvForm).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmpMv();
                                }
                            })
                        }
                    });
                } else {
                    // 不存在则是新增
                    this.$refs.empMvForm.validate(valid => {
                        if (valid) {
                            this.postRequest("/employeemv/basic/", this.empMvForm).then(resp => {
                                    this.dialogVisible = false;
                                    this.initEmpMv();
                            })
                        }
                    });
                }
                console.log(3333)
            }
        }
    }
</script>
