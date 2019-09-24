<template>
  <div>
    <Drawer v-model="value" :closable="false" width="800px">
      <Form ref="form" :model="classesObject" :rules="rules" :label-width="80">
        <FormItem prop="className" label="班级名称">
          <Input v-model="classesObject.className" placeholder="请输入班级名称"/>
        </FormItem>
        <FormItem prop="generalId" label="所属阶段">
          <Select v-model="classesObject.generalId">
            <Option :value="item.id" v-for="item in stageArray" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="startTime" label="开班时间">
          <DatePicker v-model="classesObject.startTime" type="date"></DatePicker>
        </FormItem>
        <FormItem prop="endTime" label="毕业时间">
          <DatePicker v-model="classesObject.endTime" type="date"></DatePicker>
        </FormItem>
        <FormItem prop="teacherIds" label="带班教师">
          <Select multiple filterable v-model="classesObject.teacherIds">
            <Option :value="item.id" v-for="item in teacherArray" :key="item.id">{{item.nickName}}</Option>
          </Select>
        </FormItem>
      </Form>

      <div class="demo-drawer-footer">
        <Button type="primary" @click="handleSubmit('form')" icon="md-add" style="margin-right: 5px">提交</Button>
      </div>

    </Drawer>
  </div>
</template>

<script>

  import { findGeneralByCode } from '@/api/other/general';
  import { saveOrUpdate } from '@/api/quality/classes';
  import { findTeachers } from '@/api/permission/user';
  import  { isEmpty,checkbox,length }  from '@/utils/validate'


  export default {
    name: 'add-edit-classes',
    props:{
      classNameRules :{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:'blur'},
            {max:15,min:3,message:'3-15个字符之间',trigger:'blur'}
          ]
        }
      },
      generalIdRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:"change"}
          ]
        }
      },
      startTimeRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:"change",type:'date'}
          ]
        }
      },
      endTimeRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:"change",type:'date'}
          ]
        }
      },
      teacherIdsRules:{
        type:Array,
        default:()=>{
          return [
            {validator: checkbox,trigger:'change'}
          ]
        }
      }
    },
    data(){
      return {
        value:false,
        stageArray:[],
        classesObject:{},
        teacherArray:[]
      }
    },
    computed:{
      rules(){
        return {
          className : this.classNameRules,
          generalId : this.generalIdRules,
          startTime : this.startTimeRules,
          endTime   : this.endTimeRules,
          teacherIds : this.teacherIdsRules
        }
      }
    },
    watch:{
      value(value){
        if(value){
          findGeneralByCode({"code":"STAGE"}).then(res=>this.stageArray = res.data.data);
          findTeachers().then(res=>this.teacherArray = res.data.data);
        }
      },
      'classesObject.id'(value){
        if(value){
          this.classesObject.startTime = new Date(this.classesObject.startTime)
          this.classesObject.endTime = new Date(this.classesObject.endTime)
        }
      }
    },
    methods:{
      handleSubmit(name) {
        this.$refs[name].validate(valid=>{
          if(valid){
            saveOrUpdate(this.classesObject).then(res=>{
              if(res.data.code === 10000){
                this.$Message.success(res.data.message);
              }else{
                this.$Message.success(res.data.message);
              }
              this.value = false;
              this.$parent.getClassesList(this.$parent.params);
            })
          }else{
            return false;
          }
        });
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
