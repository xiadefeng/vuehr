<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <el-input
                            style="width: 350px;margin-right: 15px;"
                            placeholder="通过员工姓名搜索员工，可以直接回车搜索..."
                            size="small"
                            v-model="keyword"
                            clearable
                            @clear="initEmps"
                            :disabled="showAdvanceSearchView"
                            @keydown.native.enter="initEmps"
                            prefix-icon="el-icon-search"></el-input>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="initEmps"
                               :disabled="showAdvanceSearchView">搜索
                    </el-button>
                    <el-button size="small" type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
                        <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                           aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :disabled="importDisabled"
                            style="display: inline-flex;margin-right: 10px;"
                            action="/employee/basic/import">
                        <el-button size="small" :disabled="importDisabled" type="success" :icon="importDataIcon">
                            {{importDataText}}
                        </el-button>
                    </el-upload>
                    <el-button size="small" type="success" icon="el-icon-download" @click="exportData('advanced')">
                        导出数据
                    </el-button>
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddEmpView">添加用户</el-button>
                </div>
            </div>
            <transition name="slide-fade">
                <div v-show="showAdvanceSearchView"
                     style="border: 1px solid #2b9fff;border-radius: 5px;box-sizing: border-box;padding: 5px 25px;margin: 10px 0px;">
                    <!--高级搜索-->
                    <el-row>
                        <el-col :span="5">
                            政治面貌：
                            <el-select size="mini" v-model="searchValue.politicId" placeholder="政治面貌"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            民族：
                            <el-select size="mini" v-model="searchValue.nationId" placeholder="请选择民族"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职位：
                            <el-select size="mini" v-model="searchValue.posId" placeholder="请选择职位"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in positions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职称：
                            <el-select size="mini" v-model="searchValue.jobLevelId" placeholder="请选择职称"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in joblevels"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            聘用形式：
                            <el-radio-group v-model="searchValue.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同" style="margin-left: -10px;">劳务合同</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            所属部门：
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="searchVisible">
                                <el-tree
                                        :data="allDeps"
                                        :props="defaultProps"
                                        default-expand-all
                                        @node-click="searchViewHandleNodeClick"></el-tree>
                                <div style="width: 130px;display: inline-flex;margin-top: 10px;margin-bottom: -5px;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 15px;box-sizing: border-box;"
                                     slot="reference"
                                     @click="searchViewShowDepView"><span style="color: #DCDFE6">{{inputDepName}}</span>
                                </div>
                            </el-popover>
                        </el-col>
                        <el-col :span="10" style="margin-top: 8px;">
                            入职日期：
                            <el-date-picker
                                    v-model="searchValue.beginDateScope"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    unlink-panels
                                    size="mini"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="5" :offset="4" style="margin-top: 10px;">
                            <el-button size="mini" @click="calcelSearch">取消</el-button>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="initEmps('advanced')">
                                搜索
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
        </div>
        <div>
            <el-table
                    :data="emps"
                    stripe
                    border
                    size="small"
                    v-loading="loading"
                    element-loading-text="正在加载数据..."
                    element-loading-spinner="el-icon-loading"
                    style="width: 100%;margin-top: 15px;">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        fixed
                        align="left"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="workID"
                        label="工号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        label="籍贯"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="politicsstatus.name"
                        label="政治面貌"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="电子邮件"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="联系地址"
                        width="190">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="所属部门"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="jobLevel.name"
                        label="职称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="聘用形式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        label="入职日期"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        label="转正日期"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        label="合同起始日期"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        label="合同截止日期"
                        width="160">
                </el-table-column>
                <el-table-column
                        label="合同期限"
                        width="120">
                    <template slot-scope="scope">
                        <el-tag size="small">{{scope.row.contractTerm}}</el-tag>
                        年
                    </template>
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        label="最高学历"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        fixed="right"
                        label="操作"
                        width="325">
                    <template slot-scope="scope">
                        <el-button @click="showEditEmpView(scope.row)" style="padding: 3px;" size="small">编辑</el-button>
                        <el-button @click="updateEmpRateById(scope.row)" style="padding: 3px;" size="small" type="primary">对该员工进行评分</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding: 3px;" size="small" type="danger">删除</el-button>
                        <el-button @click="updateEmpSalaryById(scope.row)" style="padding: 3px;" size="small" type="primary">对该员工进行调薪</el-button>
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
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="80%">
            <div>
                <el-form :model="emp" :rules="rules" ref="empForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名：" prop="name">
                                <el-input
                                        size="mini"
                                        style="width: 150px;"
                                        v-model="emp.name"
                                        prefix-icon="el-icon-edit"
                                        placeholder="请输入员工姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="性别：" prop="gender">
                                <el-radio-group v-model="emp.gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女" style="margin-left: -10px;">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出生日期：" prop="birthday">
                                <el-date-picker
                                        v-model="emp.birthday"
                                        type="date"
                                        size="mini"
                                        style="width: 160px;"
                                        format="yyyy-MM-dd"
                                        placeholder="出生日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="政治面貌：" prop="politicId">
                                <el-select size="mini" v-model="emp.politicId" placeholder="政治面貌"
                                           style="width: 180px;">
                                    <el-option
                                            v-for="item in politicsstatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族：" prop="nationId">
                                <el-select size="mini" v-model="emp.nationId" placeholder="请选择民族"
                                           style="width: 150px;">
                                    <el-option
                                            v-for="item in nations"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯：" prop="nativePlace">
                                <el-input
                                        size="mini"
                                        style="width: 150px;"
                                        v-model="emp.nativePlace"
                                        prefix-icon="el-icon-edit"
                                        placeholder="员工籍贯"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱：" prop="email">
                                <el-input
                                        size="mini"
                                        style="width: 160px;"
                                        v-model="emp.email"
                                        prefix-icon="el-icon-message"
                                        placeholder="请输入电子邮箱..."></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址：" prop="address">
                                <el-input
                                        size="mini"
                                        style="width: 180px;"
                                        v-model="emp.address"
                                        prefix-icon="el-icon-edit"
                                        placeholder="请输入联系地址..."></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="职位：" prop="posId">
                                <el-select size="mini" v-model="emp.posId" placeholder="请选择职位"
                                           style="width: 150px;">
                                    <el-option
                                            v-for="item in positions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="职称：" prop="jobLevelId">
                                <el-select size="mini" v-model="emp.jobLevelId" placeholder="请选择职称"
                                           style="width: 150px;">
                                    <el-option
                                            v-for="item in joblevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门：" prop="departmentId">
                                <el-popover
                                        placement="right"
                                        title="请选择部门"
                                        width="200"
                                        trigger="manual"
                                        v-model="visible">
                                    <el-tree
                                            :data="allDeps"
                                            :props="defaultProps"
                                            default-expand-all
                                            @node-click="handleNodeClick"></el-tree>
                                    <div style="width: 158px;display: inline-flex;margin-top: 5px;margin-bottom: -5px;
                                                font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;
                                                cursor: pointer;align-items: center;padding-left: 15px;box-sizing: border-box;"
                                         slot="reference"
                                         @click="showDepView">{{inputDepName}}
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话号码：" prop="phone">
                                <el-input
                                        size="mini"
                                        style="width: 180px;"
                                        v-model="emp.phone"
                                        prefix-icon="el-icon-phone"
                                        placeholder="请输入电话号码..."></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工号：" prop="workID">
                                <el-input
                                        size="mini"
                                        style="width: 150px;"
                                        :disabled="true"
                                        v-model="emp.workID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="学历：" prop="tiptopDegree">
                                <el-select size="mini" v-model="emp.tiptopDegree" placeholder="最高学历"
                                           style="width: 150px;">
                                    <el-option
                                            v-for="item in tiptopDegrees"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="毕业院校：" prop="school">
                                <el-input
                                        size="mini"
                                        style="width: 180px;"
                                        v-model="emp.school"
                                        prefix-icon="el-icon-edit"
                                        placeholder="请输入毕业院校..."></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称：" prop="specialty">
                                <el-input
                                        size="mini"
                                        style="width: 180px;"
                                        v-model="emp.specialty"
                                        prefix-icon="el-icon-edit"
                                        placeholder="请输入专业名称..."></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="入职日期：" prop="beginDate">
                                <el-date-picker
                                        v-model="emp.beginDate"
                                        type="date"
                                        size="mini"
                                        style="width: 160px;"
                                        format="yyyy-MM-dd"
                                        placeholder="入职日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="转正日期：" prop="conversionTime">
                                <el-date-picker
                                        v-model="emp.conversionTime"
                                        type="date"
                                        size="mini"
                                        style="width: 160px;"
                                        format="yyyy-MM-dd"
                                        placeholder="转正日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同起始日期：" prop="beginContract">
                                <el-date-picker
                                        v-model="emp.beginContract"
                                        type="date"
                                        size="mini"
                                        style="width: 160px;"
                                        format="yyyy-MM-dd"
                                        placeholder="合同起始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同终止日期：" prop="endContract">
                                <el-date-picker
                                        v-model="emp.endContract"
                                        type="date"
                                        size="mini"
                                        style="width: 160px;"
                                        format="yyyy-MM-dd"
                                        placeholder="合同终止日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身份证号码：" prop="idCard">
                                <el-input
                                        size="mini"
                                        style="width: 200px;"
                                        v-model="emp.idCard"
                                        prefix-icon="el-icon-edit"
                                        placeholder="请输入员工身份证号码..."></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="聘用形式：" prop="engageForm">
                                <el-radio-group v-model="emp.engageForm">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同" style="margin-left: -10px;">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况：" prop="wedlock">
                                <el-radio-group v-model="emp.wedlock">
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="已婚" style="margin-left: -10px;">已婚</el-radio>
                                    <el-radio label="离异" style="margin-left: -10px;">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddEmp">确 定</el-button>
  </span>
        </el-dialog>
        <div>
            <el-dialog
                    title="提示"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                <span><el-rate
                        v-model="value"
                        :show-text="true"
                        :max=5
                        :texts="texts"
                        >
</el-rate></span>
                <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doUpdateRateById">确 定</el-button>
  </span>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="工资详情" :visible.sync="dialogTableVisible" width="95%">
                <el-table :data="gridData">
                    <el-table-column property="name" label="姓名" width="100"></el-table-column>
                    <el-table-column property="gender" label="性别" width="100"></el-table-column>
                    <el-table-column property="basicSalary" label="基本工资" width="100"></el-table-column>
                    <el-table-column property="bonus" label="奖金" width="100"></el-table-column>
                    <el-table-column property="lunchSalary" label="午餐补助" width="100"></el-table-column>
                    <el-table-column property="trafficSalary" label="交通补助" width="100"></el-table-column>
                    <el-table-column property="pensionBase" label="养老金基数" width="100"></el-table-column>
                    <el-table-column property="pensionPer" label="养老金比率" width="100"></el-table-column>
                    <el-table-column property="medicalBase" label="医疗基数" width="100"></el-table-column>
                    <el-table-column property="medicalPer" label="医疗保险比率" width="110"></el-table-column>
                    <el-table-column property="accumulationFundBase" label="公积金基数" width="100"></el-table-column>
                    <el-table-column property="accumulationFundPer" label="公积金比率" width="100"></el-table-column>
                    <el-table-column property="allSalary" label="应发工资" width="100"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row);innerVisible=true">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog
                        width="80%"
                        title="调整薪资"
                        :visible.sync="innerVisible"
                        append-to-body>
                    <el-form :rules="rules" ref="adjustSalaryForm"  :model="adjustSalaryForm" label-width="80px">
                        <el-form-item label="员工姓名" prop="eid">
                            <el-select v-model="adjustSalaryForm.eid" placeholder="请选择员工名称" :disabled="true">
                                <el-option v-for="item in empNames" :key="item.id" :label="item.name" :value="item.id" > </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖惩时间" prop="asdate">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="调薪日期" v-model="adjustSalaryForm.asdate"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false" style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="调前薪资" prop="beforesalary">
                            <el-input v-model="adjustSalaryForm.beforesalary" type="number" style="width: 40%" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="调后薪资" prop="aftersalary">
                            <el-input v-model="adjustSalaryForm.aftersalary" type="number" style="width: 40%" ></el-input>
                        </el-form-item>
                        <el-form-item label="调薪原因"  prop="reason">
                            <el-input type="textarea" v-model="adjustSalaryForm.reason"></el-input>
                        </el-form-item>
                        <el-form-item label="备注"  prop="remark">
                            <el-input type="textarea" v-model="adjustSalaryForm.remark"></el-input>
                        </el-form-item>
                    </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="innerVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddadjustSalary">确 定</el-button>
  </span>
                </el-dialog>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                adjustSalaryForm:{
                    id:'',
                    eid:'',
                    asdate:'',
                    beforesalary:'',
                    aftersalary:'',
                    reason:'',
                    remark:''
                },
                empNames:[{
                    id:'',
                    name:''
                }],
                innerVisible: false,
                dialogTableVisible:false,
                gridData:[{
                    gender:'',
                    name:'',
                    workID:'',
                    basicSalary:'',
                    bonus:'',
                    lunchSalary:'',
                    trafficSalary:'',
                    pensionBase:'',
                    pensionPer:'',
                    medicalBase:'',
                    medicalPer:'',
                    accumulationFundBase:'',
                    accumulationFundPer:'',
                    allSalary:'',
                }],
                id:'',
                value:null,
                emps: [],
                texts:['20分','40分','60分','80分','100分'],
                loading: false,
                visible: false,
                centerDialogVisible: false,
                searchVisible: false,
                dialogVisible: false,
                total: 0,
                page: 1,
                size: 10,
                keyword: '',
                inputDepName: '所属部门...',
                dialogTitle: '',
                importDataText: '导入数据',
                importDataIcon: 'el-icon-upload2',
                importDisabled: false,
                showAdvanceSearchView: false,
                politicsstatus: [],
                nations: [],
                positions: [],
                joblevels: [],
                allDeps: [],
                tiptopDegrees: ['博士','硕士','研究生','本科','大专','高中','初中'],
                emp: {
                    name: "韩信",
                    gender: "男",
                    birthday: "1989-12-31 08:00:00",
                    idCard: "610122199301054789",
                    wedlock: "已婚",
                    nationId: 1,
                    nativePlace: "陕西西安",
                    politicId: 1,
                    email: "yunxing@qq.com",
                    phone: "15644442252",
                    address: "陕西西安新城区",
                    departmentId: null,
                    jobLevelId: 16,
                    posId: 34,
                    engageForm: "劳务合同",
                    tiptopDegree: "硕士",
                    specialty: "通信工程",
                    school: "西安电子科技学校",
                    beginDate: "2018-01-01 08:00:00",
                    workID: "00000006",
                    contractTerm: 5.25,
                    conversionTime: "2018-04-01 08:00:00",
                    notWorkDate: null,
                    beginContract: "2018-01-01 08:00:00",
                    endContract: "2023-04-13 08:00:00",
                    workAge: null
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    name: [{required: true, message: '请填写姓名', trigger: 'blur'}],
                    birthday: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
                    nativePlace: [{required: true, message: '请填写籍贯', trigger: 'blur'}],
                    email: [{required: true, message: '请填写电子邮箱', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: "blur"
                    }],
                    address: [{required: true, message: '请填写联系地址', trigger: 'blur'}],
                    departmentId: [{required: true, message: '请选择部门', trigger: 'blur'}],
                    phone: [{required: true, message: '请填写电话号码', trigger: 'blur'}],
                    school: [{required: true, message: '请填写毕业院校', trigger: 'blur'}],
                    specialty: [{required: true, message: '请填写专业名称', trigger: 'blur'}],
                    beginDate: [{required: true, message: '请选择入职日期', trigger: 'blur'}],
                    conversionTime: [{required: true, message: '请选择转正日期', trigger: 'blur'}],
                    beginContract: [{required: true, message: '请选择合同起始日期', trigger: 'blur'}],
                    endContract: [{required: true, message: '请选择合同终止日期', trigger: 'blur'}],
                    idCard: [{required: true, message: '请填写身份账号', trigger: 'blur'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    asdate:[{required: true, message: '请选择入职日期', trigger: 'blur'}],
                    aftersalary:[{required: true, message: '请选择入职日期', trigger: 'blur'}],
                    reason:[{required: true, message: '请选择入职日期', trigger: 'blur'}],
                    remark:[{required: true, message: '请选择入职日期', trigger: 'blur'}]

                },
                searchValue: {
                    politicId: null,
                    nationId: null,
                    posId: null,
                    jobLevelId: null,
                    engageForm: null,
                    departmentId: null,
                    beginDateScope: null
                }
            }
        },
        mounted() {
            this.initEmps();
            this.initData();
            this.initPositions();
        },
        methods: {
            doAddadjustSalary(){
                if (this.adjustSalaryForm.id) {
                    this.$refs.adjustSalaryForm.validate(valid => {
                        if (valid) {
                            this.adjustSalaryForm.eid = this.empNames[0].id
                            this.putRequest("/adjustSalary/basic/", this.adjustSalaryForm).then(resp => {
                                if (resp) {
                                    this.innerVisible = false;
                                    this.dialogTableVisible = false;
                                }
                            })
                        }
                    });
                } else {
                    // 不存在则是新增
                    this.$refs.adjustSalaryForm.validate(valid => {
                        if (valid) {
                            this.adjustSalaryForm.eid = this.empNames[0].id
                            this.postRequest("/adjustSalary/basic/", this.adjustSalaryForm).then(resp => {
                                if (resp) {
                                    this.innerVisible = false;
                                    this.dialogTableVisible = false;
                                }
                            })
                        }
                    });
                }
            },
            // 高级搜索中的取消按钮事件
            calcelSearch() {
                // 将高级搜索弹框收回
                this.showAdvanceSearchView = !this.showAdvanceSearchView;
                // 刷新数据
                this.initEmps();
            },
            // 展示高级搜索中的部门树状图
            searchViewHandleNodeClick(data) {
                // 高级搜索选择部门显示文字
                this.inputDepName = data.name;
                // 高级搜索部门编号条件
                this.searchValue.departmentId = data.id;
                // 选择完部门并关闭它
                this.searchVisible = !this.searchVisible;
            },
            // 显示高级搜索中的部门树状列表
            searchViewShowDepView() {
                this.searchVisible = !this.searchVisible;
            },
            // 导入文件失败后回调
            onError() {
                this.importDataText = '导入数据';
                this.importDataIcon = 'el-icon-upload2';
                this.importDisabled = false;
                this.initEmps();
                this.$message.success("导入失败！");
            },
            // 导入文件成功后回调
            onSuccess() {
                this.importDataText = '导入数据';
                this.importDataIcon = 'el-icon-upload2';
                this.importDisabled = false;
                this.initEmps();
                this.$message.success("导入成功！");
            },
            // 上传文件调用
            beforeUpload() {
                this.importDataText = '正在导入';
                this.importDataIcon = 'el-icon-loading';
                this.importDisabled = true;
            },
            // 分页导出员工Excel数据
            exportData(type) {
                // 去请求后端接口进行导出数据
                let url = '/employee/basic/export?page=' + this.page + "&size=" + this.size;
                // 高级搜索导出数据
                if (type && type == 'advanced') {
                    // 政治面貌
                    if (this.searchValue.politicId) {
                        url += '&politicId=' + this.searchValue.politicId;
                    }
                    // 民族
                    if (this.searchValue.nationId) {
                        url += '&nationId=' + this.searchValue.nationId;
                    }
                    // 职位
                    if (this.searchValue.posId) {
                        url += '&posId=' + this.searchValue.posId;
                    }
                    // 职称
                    if (this.searchValue.jobLevelId) {
                        url += '&jobLevelId=' + this.searchValue.jobLevelId;
                    }
                    // 部门
                    if (this.searchValue.departmentId) {
                        url += '&departmentId=' + this.searchValue.departmentId;
                    }
                    // 聘用形式
                    if (this.searchValue.engageForm) {
                        url += '&engageForm=' + this.searchValue.engageForm;
                    }
                    // 入职日期
                    if (this.searchValue.beginDateScope) {
                        url += '&beginDateScope=' + this.searchValue.beginDateScope;
                    }
                    // 如果姓名关键字不为空则添加上条件
                    if (this.keyword) {
                        url += '&name=' + this.keyword;
                    }
                }
                window.open(url, "_parent");
            },
            // 置空员工数据（防止添加员工和编辑员工搞混）
            emptyEmp() {
                this.emp = {
                    name: "",
                    gender: "",
                    birthday: "",
                    idCard: "",
                    wedlock: "",
                    nationId: 1,
                    nativePlace: "",
                    politicId: 1,
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: null,
                    jobLevelId: 16,
                    posId: 34,
                    engageForm: "",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workID: "",
                    contractTerm: "",
                    conversionTime: "",
                    notWorkDate: null,
                    beginContract: "",
                    endContract: "",
                    workAge: null
                };
                this.inputDepName = '';
            },
            handleEdit(index,row){
                this.empNames[0].id = row.id
                this.empNames[0].name = row.name
                this.adjustSalaryForm.eid = row.name
                this.adjustSalaryForm.beforesalary = row.allSalary
                this.getRequest("adjustSalary/basic/"+row.id+"/").then(resq =>{
                    console.log( resq)
                    if (resq) {
                        console.log(this.adjustSalaryForm.aftersalary)

                        console.log(this.gridData[0].allSalary)
                        this.adjustSalaryForm.id = resq.obj.id
                        this.adjustSalaryForm.asdate = resq.obj.asdate
                        this.adjustSalaryForm.beforesalary = resq.obj.beforesalary
                        this.adjustSalaryForm.aftersalary = resq.obj.aftersalary
                        this.adjustSalaryForm.reason = resq.obj.reason
                        this.adjustSalaryForm.remark = resq.obj.remark
                        this.allSalary = resq.obj.aftersalary
                    }else {
                        this.adjustSalaryForm.asdate = ''
                        this.adjustSalaryForm.aftersalary =''
                        this.adjustSalaryForm.reason = ''
                        this.adjustSalaryForm.remark = ''
                    }
                })
            },
            // 显示编辑员工视图
            showEditEmpView(data) {
                this.initPositions(); //打开添加员工视图时去加载职位信息
                this.dialogTitle = '编辑员工信息';
                // 编辑员工并显示员工的信息
                this.emp = data;
                // 将部门信息显示到编辑员工视图上
                this.inputDepName = data.department.name;
                this.dialogVisible = true;
            },
            doUpdateRateById(data){
                console.log(this.value)
                this.putRequest("employee/basic/updateRateById/"+this.id+"/"+this.value).then(resq =>{
                    if (resq) {
                        this.initEmps();
                    }
                    this.centerDialogVisible = false
                })
            },
            updateEmpRateById(data){
                console.log('查看高级资料'+JSON.stringify(data.id))
                console.log(this.value)
                this.centerDialogVisible = true
                this.id = data.id
                this.getRequest("employee/basic/getRateById/"+this.id).then(resq =>{
                    if (resq) {
                        this.value = resq.obj;
                    }
                })
            },
            updateEmpSalaryById(data){
                this.dialogTableVisible = true
                this.getRequest("/salary/sobcfg/"+data.id).then(resp => {
                    this.gridData = resp
                    this.getRequest("adjustSalary/basic/"+data.id+"/").then(resq1 =>{
                        if (resq1) {
                            this.gridData[0].allSalary= resq1.obj.aftersalary
                        }else {
                            this.gridData[0].allSalary  = resp[0].basicSalary+resp[0].bonus+resp[0].lunchSalary+resp[0].trafficSalary-(resp[0].pensionBase*resp[0].pensionPer)-(resp[0].medicalBase*resp[0].medicalPer)-(resp[0].accumulationFundBase*resp[0].accumulationFundPer);
                        }
                    })
                })
            },
            // 删除员工
            deleteEmp(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/" + data.id).then(resp => {
                        if (resp) {
                            this.initEmps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 添加员工
            doAddEmp() {
                // 如果员工id存在则是修改
                if (this.emp.id) {
                    this.$refs.empForm.validate(valid => {
                        if (valid) {
                            this.putRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmps();
                                }
                            })
                        }
                    });
                } else {
                    // 不存在则是新增
                    this.$refs.empForm.validate(valid => {
                        if (valid) {
                            this.postRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initEmps();
                                }
                            })
                        }
                    });
                }
            },
            // 隐藏添加员工中的部门树状列表
            handleNodeClick(data) {
                this.inputDepName = data.name; // 员工添加视图中——在所属部门input框赋值
                this.emp.departmentId = data.id; // 添加员工所需的部门 id
                this.visible = !this.visible;
            },
            // 显示添加员工中的部门树状列表
            showDepView() {
                this.visible = !this.visible;
            },
            // 加载员工工号
            getmaxWorkID() {
                this.getRequest("/employee/basic/maxWorkID").then(resp => {
                    if (resp) {
                        this.emp.workID = resp.obj;
                    }
                })
            },
            // 加载职位信息
            initPositions() {
                // 职位信息单独加载为的是防止管理员添加职位后，而添加员工信息时职位不显示，所以单独加载
                this.getRequest("/employee/basic/positions").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            // 加载添加所需初始数据
            initData() {
                // 如果 sessionStorage 中没有政治面貌数据再去请求服务端接口
                if (!window.sessionStorage.getItem("politicsstatus")) {
                    this.getRequest("/employee/basic/politicsstatus").then(resp => {
                        if (resp) {
                            this.politicsstatus = resp;
                            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
                }

                // 如果 sessionStorage 中没有民族数据再去请求服务端接口
                if (!window.sessionStorage.getItem("nations")) {
                    this.getRequest("/employee/basic/nations").then(resp => {
                        if (resp) {
                            this.nations = resp;
                            window.sessionStorage.setItem("nations", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
                }

                // 如果 sessionStorage 中没有职称数据再去请求服务端接口
                if (!window.sessionStorage.getItem("joblevels")) {
                    this.getRequest("/employee/basic/joblevels").then(resp => {
                        if (resp) {
                            this.joblevels = resp;
                            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
                }

                // 如果 sessionStorage 中没有部门数据再去请求服务端接口
                if (!window.sessionStorage.getItem("allDeps")) {
                    this.getRequest("/employee/basic/departments").then(resp => {
                        if (resp) {
                            this.allDeps = resp;
                            window.sessionStorage.setItem("allDeps", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
                }
            },
            // 展示添加员工视图
            showAddEmpView() {
                this.getmaxWorkID(); //加载员工自增长工号
                this.emptyEmp(); //显示添加员工视图时首先置空数据
                this.dialogTitle = '添加员工';
                this.dialogVisible = true;
            },
            // 每页条数改变事件
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initEmps('advanced');
            },
            // 当前页改变事件
            currentChange(currentPage) {
                this.page = currentPage;
                this.initEmps('advanced');
            },
            // 初始化员工信息
            initEmps(type) {
                this.loading = true;
                let url = '/employee/basic/?page=' + this.page + "&size=" + this.size;
                // 高级搜索
                if (type && type == 'advanced') {
                    // 政治面貌
                    if (this.searchValue.politicId) {
                        url += '&politicId=' + this.searchValue.politicId;
                    }
                    // 民族
                    if (this.searchValue.nationId) {
                        url += '&nationId=' + this.searchValue.nationId;
                    }
                    // 职位
                    if (this.searchValue.posId) {
                        url += '&posId=' + this.searchValue.posId;
                    }
                    // 职称
                    if (this.searchValue.jobLevelId) {
                        url += '&jobLevelId=' + this.searchValue.jobLevelId;
                    }
                    // 部门
                    if (this.searchValue.departmentId) {
                        url += '&departmentId=' + this.searchValue.departmentId;
                    }
                    // 聘用形式
                    if (this.searchValue.engageForm) {
                        url += '&engageForm=' + this.searchValue.engageForm;
                    }
                    // 入职日期
                    if (this.searchValue.beginDateScope) {
                        url += '&beginDateScope=' + this.searchValue.beginDateScope;
                    }
                } else {
                    // 普通搜索
                    // 如果姓名关键字不为空则添加上条件
                    if (this.keyword) {
                        url += '&name=' + this.keyword;
                    }
                }
                this.getRequest(url).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.emps = resp.data;
                        this.total = resp.total;
                    }
                });
            }
        }
    }
</script>

<style>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        /* .slide-fade-leave-active for below version 2.1.8 */
        transform: translateX(10px);
        opacity: 0;
    }
</style>