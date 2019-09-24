<template>
    <div>
        <Drawer v-model="value" title="查询教师信息" width="600px">
            <Input type="text" placeholder="请输入教师姓名" v-model="parent.params.nickName" style="margin-bottom: 10px"/>
            <Input type="text" placeholder="请输入电话" v-model="parent.params.telephone" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入E-mail" v-model="parent.params.email" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入户籍地址" v-model="parent.params.residenceAddress" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入现住地址" v-model="parent.params.nowAddress" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入身份证" v-model="parent.params.idCard" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入毕业院校" v-model="parent.params.graduationSchool" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入紧急联系人+电话" v-model="parent.params.emergencyContact" style="margin-bottom: 10px" />
            <Input type="text" placeholder="请输入工龄" v-model.number="parent.params.jobNumber" style="margin-bottom: 10px" />

            <!--
            <DatePicker type="date" show-week-numbers :editable="false" v-model="parent.params.birthday" placeholder="请选择生日" style="margin-bottom: 10px"></DatePicker>
            <DatePicker type="date" show-week-numbers :editable="false" v-model="parent.params.entryTime" placeholder="请选择入职时间" style="margin-bottom: 10px"></DatePicker>
            <DatePicker type="date" show-week-numbers :editable="false" v-model="parent.params.contractTime" placeholder="请选择劳动合同日期" style="margin-bottom: 10px"></DatePicker>
            -->
            <Select v-model="parent.params.education" style="margin-bottom: 10px">
                <Option :value="'1'">初中</Option>
                <Option :value="'2'">高中</Option>
                <Option :value="'3'">中专</Option>
                <Option :value="'4'">大专</Option>
                <Option :value="'5'">本科</Option>
            </Select>

            <Select v-model="parent.params.major" placeholder="请选择专业" style="margin-bottom: 10px">
                <Option :value="'1'">计算机专业</Option>
                <Option :value="'2'">其他专业</Option>
            </Select>

            <Select v-model="parent.params.deptId" placeholder="请选择选择部门" style="margin-bottom: 10px">
                <Option :value="item.id" :key="item.id" v-for="item in departmentArray">{{item.name}}</Option>
            </Select>
            <Select v-model="parent.params.jobTitle" placeholder="请选择选择职位" style="margin-bottom: 10px">
                <Option :value="item.name" :key="item.name" v-for="item in jobTitleArray">{{item.name}}</Option>
            </Select>


            <Select v-model="parent.params.laborContract" placeholder="请选择是否办理了劳动合同" style="margin-bottom: 10px">
                <Option :value="'1'">已办理</Option>
                <Option :value="'2'">未办理</Option>
            </Select>
            <Select v-model="parent.params.hasSocialSecurity" placeholder="请选择是否有社保" style="margin-bottom: 10px">
                <Option :value="'1'">有</Option>
                <Option :value="'2'">无</Option>
            </Select>

            <RadioGroup v-model="parent.params.sex" placeholder="请选择教师性别" style="margin-bottom: 10px">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
            </RadioGroup>
            <RadioGroup v-model="parent.params.hasMember" style="margin-bottom: 10px">
                <Radio label="2">未转正</Radio>
                <Radio label="1">已转正</Radio>
            </RadioGroup>
            <RadioGroup v-model="parent.params.hasLeave" style="margin-bottom: 10px">
                <Radio label="1">在职</Radio>
                <Radio label="2">离职</Radio>
            </RadioGroup>


            <div class="demo-drawer-footer">
                <Button type="error" @click="value = false,parent.getTeacherList(parent.params)">提交</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>

    import { findDepartments } from '@/api/other/department.js';
    import { findGeneralByCode } from '@/api/other/general.js';

    export default {
        name: "search-user",
        props:['parent'],
        data(){
            return {
                value:false,
                departmentArray:[],
                jobTitleArray:[]
            }
        },
        watch:{
            value(data){
                if(data){
                    findDepartments().then(res=> this.departmentArray = res.data.data);
                    findGeneralByCode({"code":"JOB-TITLE"}).then(res=> this.jobTitleArray = res.data.data)
                }
            }
        }
    }
</script>

<style scoped>
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>