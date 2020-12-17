<template>
    <div>
    <div>
        <el-row>
        <el-col :span="5" >
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1868954047,2384256876&fm=26&gp=0.jpg" class="image">
                <div style="padding: 14px;">
                    <span>{{empTran.name1}}</span>
                    <div class="bottom clearfix">
                        <time class="time">{{ currentDate }}</time>
                        <el-button type="text" class="button" @click="saveEmpTrain(1)">开始培训</el-button>
                    </div>
                </div>
            </el-card>
        </el-col>
            <el-col :span="5"  style="margin-left: 10%">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4072182278,1533975145&fm=26&gp=0.jpg" height="177.73px" class="image">
                    <div style="padding: 14px;">
                        <span>{{empTran.name2}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                            <el-button type="text" class="button" @click="saveEmpTrain(2)">开始培训</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="5" style="margin-left: 10%">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=765635970,2528661228&fm=26&gp=0.jpg" height="177.73px" class="image">
                    <div style="padding: 14px;">
                        <span>{{empTran.name3}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                            <el-button type="text" class="button" @click="saveEmpTrain(3)">开始培训</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
    </el-row>
    </div>
    <div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="60%">
            <div>
                <el-form :rules="rules" ref="emptrain"  :model="emptrain" label-width="80px">
                    <el-form-item label="员工姓名" prop="eid">
                        <el-select v-model="emptrain.eid" placeholder="请选择员工名称" @click.native="chooseEmp">
                            <el-option v-for="item in empNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="培训内容" prop="traincontent">
                        <el-input type="textarea" v-model="emptrain.traincontent"></el-input>
                    </el-form-item>
                    <el-form-item label="培训备注" prop="remark">
                        <el-input type="textarea" v-model="emptrain.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddEmptran">确 定</el-button>
  </span>
        </el-dialog>
    </div>
    </div>
</template>

<script>
    export default {
        name: "EmpTrain",
        data() {
            return {
                empTran:{
                    desc:'请员工进入以下链接进行培训学习',
                    name1:'员工入职培训一',
                    name2:'员工入职培训二',
                    name3:'员工入职培训三',
                    remark:'请完成后请告知Hr同事，感谢配合！',
                },
                empNames:[{
                    id:'',
                    name:''

                }],
                currentDate: formatDate(new Date().getTime()),
                dialogTitle: '',
                dialogVisible: false,
                emptrain:{
                    eid:'',
                    traincontent:'',
                    remark:'',
                    traindate:''
                },
                rules: {
                    eid:[{required: true, message: '请选择培训员工', trigger: 'blur'}],
                    traincontent:[{required: true, message: '请填写奖惩原因', trigger: 'blur'}],
                    remark:[{required: true, message: '请填写奖惩原因', trigger: 'blur'}],
                }
            };
        },
        methods:{
            saveEmpTrain(type){
                this.emptrain.eid=''
                this.dialogVisible = true
                this.emptrain.remark = this.empTran.remark
                this.emptrain.traindate = this.currentDate
                if (type===1){
                   this.emptrain.traincontent =  this.empTran.name1+"\n"+this.empTran.desc+"htttp://www.baidu.com"
                }else if (type === 2){
                    //进入培训2
                    this.emptrain.traincontent =  this.empTran.name1+"\n"+this.empTran.desc+"htttp://www.qq.com"
                }else {
                    this.emptrain.traincontent =  this.empTran.name1+"\n"+this.empTran.desc+"htttp://www.weibo.com"
                }
                //this.getRequest()

            },
            doAddEmptran(){
                console.log("1111")
                this.$refs.emptrain.validate(valid => {
                    if (valid) {
                        this.postRequest("/employeetrain/basic/", this.emptrain).then(resp => {
                            if (resp) {
                                this.dialogVisible = false;
                            }
                        })
                    }
                });
            },
            //下拉选择员工
            chooseEmp(){
                this.getRequest("/employee/basic/names").then(resp => {
                    if (resp){
                        this.empNames = resp
                    }
                })
            },
        }
    }
    function add0(m){return m<10?'0'+m:m }
    function formatDate(needTime)
    {
        //needTime是整数，否则要parseInt转换
        var time = new Date(needTime);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
</script>

<style scoped>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>