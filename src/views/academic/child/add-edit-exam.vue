<template>
  <Drawer v-model="value" title="试卷信息" width="800px" :closable="false" :mask-closable="false">
    <template slot="header">
      <span style="color: green;font-size: 20px;margin-right: 10px">试题信息</span>
      <Button type="primary" @click="handleSubmit('form')" size="small"  icon="md-add" style="margin-right: 5px">提交</Button>
      <Button type="error" @click="cancel" size="small" icon="md-add">关闭</Button>
    </template>

    <Form ref="form" :model="examObject" :rules="rules" :label-width="80">
      <FormItem prop="examName" label="试卷名称">
        <Input type="text" placeholder="请输入试卷名称" v-model="examObject.examName" />
      </FormItem>

      <FormItem prop="examTime" label="考试时间">
        <DatePicker type="datetime" v-model="examObject.examTime" placeholder="请选择考试时间"></DatePicker>
      </FormItem>
      <FormItem prop="examTimeLength" label="考试时长">
        <Input type="text" placeholder="请输入考试时长" v-model="examObject.examTimeLength" />
      </FormItem>
      <FormItem prop="examType" label="试卷类型">
        <Select v-model="examObject.examType" placeholder="请选择试卷类型">
          <Option :value="1">日测</Option>
          <Option :value="2">周测</Option>
          <Option :value="3">月考</Option>
        </Select>
      </FormItem>

      <FormItem prop="classId" label="所考班级">
        <Select v-model="examObject.classId" placeholder="请选择考试班级">
          <Option :value="item.id" :key="item.id" v-for="item in classArray">{{item.className}}</Option>
        </Select>
      </FormItem>

      <FormItem prop="chapterIdsArray" label="所考课程">
        <Select  v-model="examObject.chapterIdsArray" multiple filterable :label-in-value="true" @on-change="chapterChange">
          <OptionGroup :label="general.general.name" v-for="general in lessionArray" :key="general.id">
            <Option v-for="item in general.children" :key="item.id" :value="item.id">{{item.name}}</Option>
          </OptionGroup>
        </Select>
      </FormItem>

      <FormItem prop="questionTypeIdsArray" label="试题类型">
        <CheckboxGroup ref="questionType" v-model="examObject.questionTypeIdsArray" placeholder="请选择试题类型">
          <Checkbox label="1">单选题</Checkbox>
          <Checkbox label="2">多选题</Checkbox>
          <Checkbox label="3">问答题</Checkbox>
          <Checkbox label="4">上机题</Checkbox>
        </CheckboxGroup>
      </FormItem>

      <Alert type="error" show-icon :style="{display:hidden.message}">
        <template slot="desc">你所选【所考课程】只有
          <span style="color:red">{{count.single}}</span> 道单选题,
          <span style="color:red">{{count.mutiple}}</span> 道多选题,
          <span style="color:red">{{count.ask}}</span> 道问答题,
          <span style="color:red">{{count.upper}}</span> 道上机题
        </template>
      </Alert>
      <FormItem :style="{display:hidden.single}" prop="singleCount" label="单选数量">
        <Input type="text" placeholder="请输入单选题数量" v-model="examObject.singleCount" />
      </FormItem>
      <FormItem :style="{display:hidden.single}" prop="singleScore" label="单题分数">
        <Input type="text" placeholder="请输入单选题每题分数" v-model="examObject.singleScore" />
      </FormItem>


      <FormItem :style="{display:hidden.mutiple}"  prop="mutipleCount" label="多选数量">
        <Input type="text" placeholder="请输入多选题数量" v-model="examObject.mutipleCount"/>
      </FormItem>
      <FormItem :style="{display:hidden.mutiple}"  prop="mutipleScore" label="多选分数">
        <Input type="text" placeholder="请输入多选题每题分数" v-model="examObject.mutipleScore"/>
      </FormItem>


      <FormItem :style="{display:hidden.ask}"  prop="askCount" label="问答数量">
        <Input type="text" placeholder="请输入问答题数量" v-model="examObject.askCount"/>
      </FormItem>
      <FormItem :style="{display:hidden.ask}"  prop="askScore" label="问答分数">
        <Input type="text" placeholder="请输入问答题每题分数" v-model="examObject.askScore"/>
      </FormItem>


      <FormItem :style="{display:hidden.upper}"  prop="upperCount" label="上机题数量">
        <Input type="text" placeholder="请输入上机题数量" v-model="examObject.upperCount"/>
      </FormItem>
      <FormItem :style="{display:hidden.upper}"  prop="upperScore" label="上机题分数">
        <Input type="text" placeholder="请输入上机题每题分数" v-model="examObject.upperScore"/>
      </FormItem>

    </Form>
  </Drawer>
</template>

<script>

  import { findClasses } from '@/api/quality/classes';
  import { findGenerals } from '@/api/other/general';
  import { saveOrUpdate } from '@/api/academic/exam';
  import { count } from '@/api/academic/questions';

  export default {
    name: 'add-edit-exam',
    data(){
      return {
        value:false,
        examObject:{
        },
        rules:{
          examName:[
            {required:true,message:'必填',trigger:'blur'}
          ]
        },
        classArray:[],
        lessionArray:[],
        showLessionArray:[],//展示在页面上所选课程的集合(只作为展示)
        count:{
          single:0,
          mutiple:0,
          ask:0,
          upper:0
        },
        hidden:{
          single:'none',
          mutiple:'none',
          ask:'none',
          upper:'none',
          message:'none'
        }
      };
    },
    watch:{
      value(value){
        if(value){
          findClasses().then(res=>this.classArray = res.data.data);
          findGenerals().then(res=>this.lessionArray = res.data.data);
        }
      },
      showLessionArray(value){
        if(value && value.length > 0){
          //查询当前课程有多少试题
          let arr = [];
          value.forEach(item=>{
            arr.push(item.value);
          });
          let ids = arr.join(',');
          count(ids).then(res=>{
            let {singleCount,mutipleCount,askCount,upperCount} = res.data.data;
            this.count.single = singleCount;
            this.count.mutiple = mutipleCount;
            this.count.ask = askCount;
            this.count.upper = upperCount;
          });

        }
      },
      'examObject.questionTypeIdsArray'(value){

        if(value.length != 1 && value.includes("4")){
          this.$Message.error("上机题需要独立出题");
          return false;
        }

        if(value && value.length > 0){
          if(value.includes('1')){
            this.hidden.single='block';
            this.hidden.message='block';
          } else {
            this.hidden.single='none';
          }

          if(value.includes('2')){
            this.hidden.message='block';
            this.hidden.mutiple='block';
          }else{
            this.hidden.mutiple='none';
          }

          if(value.includes('3')){
            this.hidden.message='block';
            this.hidden.ask='block';
          } else{
            this.hidden.ask='none';
          }

          if(value.includes('4')){
            this.hidden.message='block';
            this.hidden.upper='block';
          } else{
            this.hidden.upper='none';
          }

        }else if(value && value.length == 0){
          this.hidden.single='none';
          this.hidden.mutiple='none';
          this.hidden.ask='none';
          this.hidden.upper='none';
          this.hidden.message='none';
        }
      }
    },
    methods:{
      chapterChange(data){
        this.showLessionArray = data;
      },
      cancel(){
        this.hidden.single='none';
        this.hidden.mutiple='none';
        this.hidden.ask='none';
        this.hidden.upper='none';
        this.count={ single:0, mutiple:0, ask:0};
        this.examObject = {};
        this.classArray = [];
        this.lessionArray=[];
        this.showLessionArray=[];
        this.value = false;
      },
      handleSubmit(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            let singleCount = this.examObject.singleCount  || 0;
            let singleScore = this.examObject.singleScore  || 0;

            let mutipleCount = this.examObject.mutipleCount  || 0;
            let mutipleScore = this.examObject.mutipleScore  || 0;

            let askCount = this.examObject.askCount  || 0;
            let askScore = this.examObject.askScore  || 0;

            let upperCount = this.examObject.upperCount  || 0;
            let upperScore = this.examObject.upperScore || 0;


            let total = singleCount * singleScore + mutipleCount * mutipleScore + askCount * askScore + upperCount * upperScore;

            let questionTypes = this.examObject.questionTypeIdsArray;

            if(questionTypes.length > 1 && questionTypes.includes("4")){
              this.$Message.error("不能发布,上机题需要独立出题");
              return false;
            }

            if(!questionTypes || questionTypes.length == 0){this.$Message.error("请选择试题类型");return false;}
            if(this.examObject.examName && this.examObject.examName.trim().length > 10){this.$Message.error("请考试名称应小于10个字符");return false;}
            if(!this.examObject.examTime){this.$Message.error("请选择考试时间");return false;}
            if(!this.examObject.examTimeLength){this.$Message.error("请输入考试时长");return false;}
            if(!this.examObject.classId || this.examObject.classId.length == 0){this.$Message.error("请选择考试班级");return false;}
            if(!this.examObject.chapterIdsArray || this.examObject.chapterIdsArray.length == 0){this.$Message.error("请选择所考课程");return false;}
            if(!this.examObject.examType || this.examObject.examType.length == 0){this.$Message.error("请选择试卷类型");return false;}

            let type = questionTypes.join(",");

            if(total != 100){this.$Message.error("总分必须是100分");return false;}
            if(type.includes("1") && singleScore * singleScore == 0){this.$Message.error("单选题得分不能为0");return false;}
            if(type.includes("1") &&  singleCount > this.count.single){this.$Message.error("单选题数量过多");return false;}
            if(type.includes("2") && mutipleCount > this.count.mutiple){this.$Message.error("多选题数量过多");return false;}
            if(type.includes("2") && mutipleScore * mutipleCount == 0){this.$Message.error("多选题得分不能为0");return false;}
            if(type.includes("3") && askCount > this.count.ask){this.$Message.error("问答题数量过多");return false;}
            if(type.includes("3") && askCount * askScore == 0){this.$Message.error("问答题得分不能为0");return false;}



            saveOrUpdate(this.examObject).then(res=>{
              if(res.data.code == 10000){
                this.$Message.success(res.data.message);
              }else{
                this.$Message.error(res.data.message);
              }
              this.value = false;
              this.$parent.getExamList(this.$parent.params);
            });
          }else{
            return false;
          }
        });
      }
    },
    created(){
      this.hidden.single='none';
      this.hidden.mutiple='none';
      this.hidden.ask='none';
      this.hidden.upper='none';
      this.hidden.message='none';
      this.count = {single:0,mutiple:0,ask:0,upper:0};
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
