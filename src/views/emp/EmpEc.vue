<template>
    <div>
        <div>
            <el-input
                    style="width: 350px;margin-right: 15px;"
                    placeholder="通过员工姓名搜索奖惩项，可以直接回车搜索..."
                    size="small"
                    v-model="keyword"
                    clearable
                    @clear="initEmpecs"
                    :disabled="showAdvanceSearchView"
                    @keydown.native.enter="initEmpecs"
                    prefix-icon="el-icon-search"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="initEmpecs"
                       :disabled="showAdvanceSearchView">搜索
            </el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addEmpEc" style="float: right;margin-bottom: 20px">添加奖惩信息</el-button>
        </div>
        <div>
        <el-table
                :data="empecs"
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
                    fixed
                    prop="ecdate"
                    label="奖惩日期"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="ecreason"
                    label="奖惩原因"
                    width="400">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="ecpoint"
                    label="奖罚分"
                    width="120">
            </el-table-column>
            <el-table-column
                    :formatter="ectypeFormatter"
                    align="center"
                    prop="ectype"
                    label="奖罚类别"
                    width="100">
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
                    width="250">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                    width="60%">
                <div>
                    <el-form :rules="rules" ref="employeeecForm"  :model="employeeec" label-width="80px">
                        <el-form-item label="员工姓名" prop="eid">
                            <el-select v-model="employeeec.eid" placeholder="请选择员工名称" @click.native="chooseEmp" :disabled="flags">
                                <el-option v-for="item in empNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖惩时间" prop="ecdate">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="employeeec.ecdate"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false" style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="奖惩原因" prop="ecreason">
                            <el-input type="textarea" v-model="employeeec.ecreason"></el-input>
                        </el-form-item>
                        <el-form-item label="奖惩分值" prop="ecpoint">
                            <el-input v-model="employeeec.ecpoint" type="number" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item label="奖罚类别">
                                <el-radio v-model="employeeec.ectype" :label="0" style="margin-top: 1.5%" checked="checked">奖励</el-radio>
                                <el-radio v-model="employeeec.ectype" :label="1"  style="margin-top: 1.5%">惩罚</el-radio>
                        </el-form-item>
                        <el-form-item label="备注"  prop="remark">
                            <el-input type="textarea" v-model="employeeec.remark"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddEmpeec">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpEc",
        data() {
            return {
                empecs:[],
                showAdvanceSearchView: false,
                keyword: '',
                flags:false,
                radio: '0',
                dialogTitle: '',
                total: 0,
                page: 1,
                size: 10,
                loading: false,
                empNames:[{
                    id:'',
                    name:''
                }],
                dialogVisible: false,
                employeeec: {
                    eid:'',
                    ecdate: '',
                    ectype: '',
                    ecpoint: '',
                    remark: '',
                    ecreason: '',
                },
                rules: {
                    eid:[{required: true, message: '请选择员工', trigger: 'blur'}],
                    ecdate:[{required: true, message: '请填写奖惩时间', trigger: 'blur'}],
                    ecreason:[{required: true, message: '请填写奖惩原因', trigger: 'blur'}],
                    ecpoint:[{required: true, message: '请输入奖惩分值', trigger: 'blur'}],
                    remark: [{required: true, message: '请填写奖惩备注', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initEmpecs();
            //this.initData();
            //this.initPositions();
        },
        methods: {
            initEmpecs(){
                this.loading = true;
                let url = '/employeeec/basic/?page=' + this.page + "&size=" + this.size;
                // 普通搜索
                // 如果姓名关键字不为空则添加上条件
                if (this.keyword) {
                    url += '&employeeNameDto.name=' + this.keyword;
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.empecs = resp.data;
                        this.total = resp.total;
                    }
                });
              console.log('000')
            },
            ectypeFormatter(row,column){
                let type = row.ectype;
                if(type === 0){
                    return '奖励'
                } else {
                    return "惩罚"
                }
            },
            handleEdit(index,row) {
                this.dialogTitle = '修改奖惩信息';
                this.dialogVisible=true,
                this.employeeec = row;
                this.employeeec.eid = row.employeeNameDto.name
                this.flags = true
                this.employeeec.ectype = row.ectype
                console.log(this.employeeec.ectype)
                console.log(row);
            },
            handleDelete(index,row){
                this.$confirm('此操作将永久删除【' + row.employeeNameDto.name + '】员工的奖惩项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employeeec/basic/" + row.id).then(resp => {
                        if (resp) {
                            this.initEmpecs();
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
                this.initEmpecs();
            },
            // 每页条数改变事件
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initEmpecs();
            },
            addEmpEc(){
                this.emptyEmpec();
                this.dialogTitle = '添加奖惩信息';
                this.dialogVisible = true;
                this.flags = false
            },
            onSubmit() {
                console.log('submit!');
            },
            emptyEmpec(){
                this.employeeec = {
                    eid:'',
                    ecdate: '',
                    ectype: '',
                    ecpoint: '',
                    remark: '',
                    ecreason: '',
                    employeeNameDto:{
                        id:'',
                        name:''
                    }
                };
            },
            //下拉选择员工
            chooseEmp(){
                this.getRequest("/employee/basic/names").then(resp => {
                    if (resp){
                        this.empNames = resp
                    }
                })
            },
            doAddEmpeec(){
                // 如果员工id存在则是修改
                if (this.employeeec.id) {
                    this.$refs.employeeecForm.validate(valid => {
                        if (valid) {
                            this.employeeec.eid = this.employeeec.employeeNameDto.id
                            this.putRequest("/employeeec/basic/", this.employeeec).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmpecs();
                                }
                            })
                        }
                    });
                } else {
                    // 不存在则是新增
                    this.$refs.employeeecForm.validate(valid => {
                        if (valid) {
                            this.postRequest("/employeeec/basic/", this.employeeec).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmpecs();
                                }
                            })
                        }
                    });
                }
                console.log(3333)
            }
        }
    }
</script>

<style scoped>

</style>