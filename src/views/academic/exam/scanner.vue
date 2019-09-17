<template>
  <div>
    <Card :bordered="false" :dis-hover="true" style="height: 50px;">

      <Select clearable v-model="params.classesId" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择班级">
        <Option :value="item.id" v-for="item in classesArray">{{item.className}}</Option>
      </Select>

      <Input v-model="params.examName" style="width: 150px;margin-right: 5px;float: left" placeholder="请输入试卷名称" />

      <Select clearable v-model="params.examType" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择试卷类型">
        <Option :value="1">日测</Option>
        <Option :value="2">周测</Option>
        <Option :value="3">月考</Option>
      </Select>

      <Select clearable v-model="params.examStatus" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择试卷状态">
        <Option :value="1">未开始</Option>
        <Option :value="2">进行中</Option>
        <Option :value="3">批阅中</Option>
        <Option :value="4">已结束</Option>
      </Select>

      <Button type="info" @click="getExamList(params)" style="width: 150px;margin-right: 5px;float: left">查询数据</Button>
      <Button type="info" @click="params = {page:1,size:10},getExamList(params)" style="width: 150px;margin-right: 5px;float: left">重置查询</Button>

      <Button type="primary" @click="openWindow('addEditExam',null)" style="width: 150px;margin-right: 5px;float: right">新增试卷(选择/问答)</Button>
      <Button type="primary" @click="openUpperWindow('addEditUpperExam',null)" style="width: 150px;margin-right: 5px;float: right">新增试卷(上机)</Button>
    </Card>
    <Card :bordered="false" :dis-hover="true">
      <self-table :list="getExamList" :data="examArray" :columns="columns" :loading="loading" :params="params"></self-table>
    </Card>

    <add-edit-exam ref="addEditExam"></add-edit-exam>
    <add-edit-upper-exam ref="addEditUpperExam"></add-edit-upper-exam>
  </div>
</template>

<script>

  import { formatDate } from '@/utils/tools';
  import { list,startExam } from '@/api/academic/exam';
  import { findClasses } from '@/api/quality/classes';

  export default {
    name: 'exam-scanner',
    components:{
      AddEditExam:()=>import("@/views/academic/child/add-edit-exam.vue"),
      AddEditUpperExam:()=>import("@/views/academic/child/add-edit-upper-exam.vue")
    },
    data(){
      return {
        loading:true,
        params:{page:1,size:20,total:0},
        examArray:[],
        classesArray:[],
        rowData:{},
        hiddenInfo:'none'
      };
    },
    methods:{
      openWindow(name,data){
        this.$refs[name].examObject = {};
        this.$refs[name].value = true;
      },
      openUpperWindow(name,data){
        this.$refs[name].upperExamObject = {};
        this.$refs[name].value = true;
      },
      getExamList(data){
        list(this.params).then(res=>{
          this.examArray = res.data.data.rows;
          this.params.total = res.data.data.total;
          this.loading = false;
        });
      },
      startExam(data){
        this.$Modal.confirm({
          title:'友情提示',
          content:`确定要开启【${data.examName}】考试吗`,
          onOk:()=>{
            startExam(data).then(res=>{
              if(res.data.code == 10000){
                this.$Message.success(res.data.message);
              }else{
                this.$Message.error(res.data.message);
              }
              this.getExamList(this.params);
            })
          }
        })
      }
    },
    computed:{
      columns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'className',title:'班级名称',align:'center'},
          {key:'examTime',title:'考试时间',align:'center',render(h,params){
              return h('span',{},formatDate(params.row.examTime));
            }},
          {key:'examTimeLength',title:'考试时长',align:'center'},
          {key:'examName',title:'试卷名称',align:'center',render(h,params){
            //用于点击名称后,显示详情
              return h('a',{on:{click() {
                    that.rowData = params.row;
                    that.hiddenInfo = 'block';
                  }}},params.row.examName);}
          },
          {key:'examType',title:'试卷类型',align:'center',render(h,params){
              return h('Tag',{props:{color:params.row.examType == 1? 'warning' : (params.row.examType == 2? 'primary':'error')}},params.row.examType == 1? '日测' : (params.row.examType == 2? '周测':'月考'));
            }},
          {key:'examStatus',title:'试卷状态',align:'center',render(h,params){
              return h('Tag',{props:{color:params.row.examStatus == '1' ? 'pink' : (params.row.examStatus == '2' ? 'error' : (params.row.examStatus == '3' ? 'warning' : 'info'))}},
                  params.row.examStatus == '1' ? '未开始' : (params.row.examStatus == '2' ? '进行中' : (params.row.examStatus == '3' ? '批阅中' : '已结束')));
            }},
          {key:'opt',title:'操作',align:'center',render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',icon:'md-bulb',size:'small',disabled: params.row.examStatus == 1 ? false : true },on:{click(){
                      that.startExam(params.row);
                    }}},'开始考试')
              ],'');
            }}
        ];
      }
    },
    created(){

      findClasses().then(res=>this.classesArray = res.data.data);

      this.getExamList(this.params);
    }
  };
</script>

<style scoped>

</style>
