<template>
  <div>
    <Drawer  v-model="value" title="教师信息" width="600px">
      <Form ref="form" inline :model="teacherObject" :rules="rules" :label-width="80">
        <FormItem prop="nickName" label="姓名">
          <Input type="text" placeholder="请输入姓名" v-model="teacherObject.nickName" />
        </FormItem>
        <FormItem prop="telephone" label="电话">
          <Input type="text" placeholder="请输入电话" v-model="teacherObject.telephone" />
        </FormItem>
        <FormItem prop="email" label="E-mail">
          <Input type="text" placeholder="请输入E-mail" v-model="teacherObject.email" />
        </FormItem>
        <FormItem prop="sex" label="性别">
          <RadioGroup v-model="teacherObject.sex" placeholder="请选择教师性别">
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="residenceAddress" label="户籍">
          <Input type="text" placeholder="请输入户籍" v-model="teacherObject.residenceAddress" />
        </FormItem>
        <FormItem prop="nowAddress" label="现住址">
          <Input type="text" placeholder="请输入户籍" v-model="teacherObject.nowAddress" />
        </FormItem>
        <FormItem prop="idCard" label="身份证">
          <Input type="text" placeholder="请输入身份证" v-model="teacherObject.idCard" />
        </FormItem>
        <FormItem prop="birthday" label="生日">
          <DatePicker type="date" v-model="teacherObject.birthday" placeholder="请选择生日" style="width: 162px;"></DatePicker>
        </FormItem>
        <FormItem prop="education" label="学历" placeholder="请选择学历" >
          <Select v-model="teacherObject.education" style="width: 162px;">
            <Option :value="'1'">初中</Option>
            <Option :value="'2'">高中</Option>
            <Option :value="'3'">中专</Option>
            <Option :value="'4'">大专</Option>
            <Option :value="'5'">本科</Option>
          </Select>
        </FormItem>
        <FormItem prop="graduationSchool" label="毕业院校">
          <Input type="text" placeholder="请输入毕业院校" v-model="teacherObject.graduationSchool" />
        </FormItem>
        <FormItem prop="major" label="专业">
          <Select v-model="teacherObject.major" placeholder="请选择专业" style="width: 162px;">
            <Option :value="'1'">计算机专业</Option>
            <Option :value="'2'">其他专业</Option>
          </Select>
        </FormItem>
        <FormItem prop="emergencyContact" label="紧急联络">
          <Input type="text" placeholder="请输入紧急联系人+电话" v-model="teacherObject.emergencyContact" />
        </FormItem>
        <FormItem prop="relation" label="关系">
          <Input type="text" placeholder="请输入紧急联系人+电话" v-model="teacherObject.relation" />
        </FormItem>
        <FormItem prop="deptId" label="选择部门">
          <Select v-model="teacherObject.deptId" placeholder="请选择选择部门" style="width: 162px;">
            <Option :value="item.id" :key="item.id" v-for="item in departmentArray">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="jobTitle" label="职位名称">
          <Select v-model="teacherObject.jobTitle" placeholder="请选择选择职位" style="width: 162px;">
            <Option :value="item.name" :key="item.name" v-for="item in jobTitleArray">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="entryTime" label="入职时间">
          <DatePicker v-model="teacherObject.entryTime" placeholder="请选择入职时间" style="width: 162px;"></DatePicker>
        </FormItem>
        <FormItem prop="hasMember" label="是否转正">
          <RadioGroup v-model="teacherObject.hasMember"style="width: 162px;">
            <Radio label="2">未转正</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="hasLeave" label="在职状态" style="width: 162px;">
          <RadioGroup v-model="teacherObject.hasLeave"style="width: 162px;">
            <Radio label="1">在职</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="jobNumber" label="工龄">
          <Input type="text" placeholder="请输入工龄" v-model.number="teacherObject.jobNumber" />
        </FormItem>
        <FormItem prop="laborContract" label="劳动合同">
          <Select v-model="teacherObject.laborContract" placeholder="请选择是否办理了劳动合同" style="width: 162px;">
            <Option :value="'1'">已办理</Option>
            <Option :value="'2'">未办理</Option>
          </Select>
        </FormItem>
        <FormItem prop="contractTime" label="合同日期">
          <DatePicker v-model="teacherObject.contractTime" placeholder="请选择劳动合同日期" style="width: 162px;"></DatePicker>
        </FormItem>
        <FormItem prop="contractNumber" label="续签天数">
          <Input v-model.number="teacherObject.contractNumber" placeholder="请输入续签天数" />
        </FormItem>
        <FormItem prop="hasSocialSecurity" label="有无社保" >
          <Select v-model="teacherObject.hasSocialSecurity" placeholder="请选择是否有社保" style="width: 162px;">
            <Option :value="'1'">有</Option>
            <Option :value="'2'">无</Option>
          </Select>
        </FormItem>
      </Form>

      <div class="demo-drawer-footer">
        <Button type="primary" @click="handleSubmit('form')" icon="md-add" style="margin-right: 5px">提交</Button>
        <Button type="error" @click="value = false" icon="md-add">关闭</Button>
      </div>

    </Drawer>
  </div>
</template>

<script>

  import { findDepartments } from '@/api/other/department.js';
  import { findGeneralByCode } from '@/api/other/general.js';
  import { saveOrUpdate } from '@/api/permission/user.js';

  export default {
    name: 'add_edit_teacher',
    data(){
      return{
        value :false,
        teacherObject:{},
        rules:{},
        departmentArray:[],
        jobTitleArray:[]//职位名称
      };
    },
    watch:{
      value(value){
        if(value){
          //加载部门
          findDepartments().then(res=> this.departmentArray = res.data.data);
          findGeneralByCode({"code":"JOB-TITLE"}).then(res=> this.jobTitleArray = res.data.data)
        }
      }
    },
    methods:{
      handleSubmit(name){
        saveOrUpdate(this.teacherObject).then(res=>{
          if(res.data.code === 10000){
            this.$Message.success(res.data.message);
          }else{
            this.$Message.success(res.data.message);
          }
          this.value = false;
          this.$parent.getTeacherList(this.$parent.params);
        })
      }
    }
  };
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
