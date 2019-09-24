<template>
  <div>
    <Drawer v-model="value" :closable="false" :mask-closable="false" :width="700">
      <Form ref="form" :model="questionObject" :label-width="80" :rules="rules">
        <!--公共的表单项-->
        <FormItem prop="discipline" label="学科">
          <Select v-model="questionObject.discipline">
            <Option :value="'1'">软件</Option>
            <Option :value="'2'">网络</Option>
          </Select>
        </FormItem>

        <FormItem prop="lessionId" label="课程">
          <Select v-model="questionObject.lessionId" placeholder="请选择课程">
            <OptionGroup :key="general.id" v-for="general in lessionArray" :label="general.general.name">
              <Option :value="item.id" :key="item.id" v-for="item in general.children">{{item.name}}</Option>
            </OptionGroup>
          </Select>
        </FormItem>

        <FormItem prop="sourced" label="来源" style="width: 600px">
          <Select v-model="questionObject.sourced">
            <Option :value="'1'">课程试题</Option>
            <Option :value="'2'">面试宝典</Option>
            <Option :value="'3'">企业真题</Option>
          </Select>
        </FormItem>


        <FormItem label="企业" :style="{display:styleValue}" prop="companyId" error="请选择企业" :required="(questionObject.sourced && questionObject.sourced.includes('3')) ? true:false">
          <Select v-model="questionObject.companyId" :clearable="true" :filterable="true" style="width: 686px">
            <Option :value="item.id" :key="item.id" v-for="item in companyArray">{{item.name}}</Option>
          </Select>
        </FormItem>

        <!--:style="{display: typeHiddenStyle}" 这个是用于修改的,也就是修改操作时,隐藏这个RadioGroup-->
        <FormItem prop="type" label="题型" :style="{display: typeHiddenStyle}">
          <RadioGroup ref="radioGroup" v-model="questionObject.type" type="button" @on-change="typeChange">
            <Radio label="1">单选题</Radio>
            <Radio label="2">多选题</Radio>
            <Radio label="3">问答题</Radio>
            <Radio label="4">上机题</Radio>
          </RadioGroup>
        </FormItem>

        <single-component ref="single" :parent="this"></single-component>
        <mutiple-component ref="mutiple" :parent="this"></mutiple-component>
        <ask-component ref="ask" :parent="this"></ask-component>
        <upper-component ref="upper" :parent="this" :requestParams="requestParams"></upper-component>
      </Form>

      <div class="demo-drawer-footer">
        <Button type="primary" @click="saveOrUpdate('form')" icon="md-add" style="margin-right: 5px">提交</Button>
        <Button type="error" @click="cancel" icon="md-add">关闭</Button>
      </div>

    </Drawer>




  </div>
</template>
<script>

  import { findGenerals } from "@/api/other/general";
  import { findCompanys } from "@/api/job/company";
  import { saveOrUpdate } from "@/api/academic/questions";

  export default {
    name:'add-edit-question',
    props:{
      parent:{
        type:Object
      },
      disciplineRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必选项',trigger:'change'}
          ];
        }
      },
      lessionIdRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必选项',trigger:'change'}
          ];
        }
      },
      sourcedRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必选项',trigger:'change'}
          ];
        }
      },
      typeRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必选项',trigger:'change'}
          ];
        }
      }
    },
    components:{
      SingleComponent:()=>import('@/views/academic/child/add-edit-single.vue'),
      MutipleComponent:()=>import('@/views/academic/child/add-edit-mutiple.vue'),
      AskComponent:()=>import('@/views/academic/child/add-edit-ask.vue'),
      UpperComponent:()=>import('@/views/academic/child/add-edit-upper.vue')
    },
    data(){
      return {
        value:false,
        questionObject:{}, //公共数据
        totalObject:{}, //子类数据
        lessionArray:[],//课程集合
        companyArray:[],//企业集合
        styleValue:'none',//来源如果选择是企业真题则进行显示, 如果选择的不是企业真题,则隐藏企业的选择
        typeHiddenStyle:'block',//这个是用于修改的,也就是修改操作时,隐藏这个RadioGroup
        requestParams:{} //最终提交的表单数据
      }
    },
    watch:{
      value(data){
        if(data){

          this.single.singleStyle = 'none';
          this.mutiple.mutipleStyle = 'none';
          this.ask.askStyle = 'none';
          this.upper.upperStyle = 'none';

          findGenerals().then(res=>this.lessionArray = res.data.data);
        }
      },
      'questionObject.sourced'(data){  //监听来源, 如果是3则显示企业项
        if(data == '3'){
          findCompanys().then(res=>this.companyArray = res.data.data);
          this.styleValue = 'block';
        }else{
          this.styleValue = 'none';
        }
      },
      'questionObject.id'(data){
        if(data){
          this.typeHiddenStyle = 'none'; //隐藏题型单选按钮
          let type = this.questionObject.type;
          switch (type) {  //执行孙子类数据的回显
            case '1':
              this.single.singleObject = this.totalObject;
              this.single.singleStyle = 'block';
              break;
            case '2':
              this.mutiple.mutipleObject = this.totalObject;
              this.mutiple.mutipleStyle = 'block';
              break;
            case '3':
              this.ask.askObject = this.totalObject;
              this.ask.askStyle = 'block';
              break;
            case '4':
              this.upper.upperObject = this.totalObject;
              this.upper.upperStyle = 'block';
              break;
          }
        }else{
          this.typeHiddenStyle = 'block'; //隐藏题型单选按钮
        }
      }
    },
    computed:{
      rules(){
        return {
          discipline: this.disciplineRules,
          lessionId: this.lessionIdRules,
          sourced: this.sourcedRules,
          type: this.typeRules
        }
      },
      single(){
        return this.$refs['single'];
      },
      mutiple(){
        return this.$refs['mutiple'];
      },
      ask(){
        return this.$refs['ask'];
      },
      upper(){
        return this.$refs['upper'];
      }
    },
    methods:{
      saveOrUpdate(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            if(this.questionObject.type.includes("1")){

              this.requestParams = {};
              let singleData = this.single.singleObject;

              if(!singleData.singleContent){this.$Message.error("单选题题干不能为空");return false}
              if(singleData.singleContent.length < 3){this.$Message.error("单选题干不能小于3字符");return false}
              if(singleData.singleContent.length > 250){this.$Message.error("单选题干不能超过250字符");return false}

              if(!singleData.singleOptionA){this.$Message.error("选项A不能为空");return false}
              if(singleData.singleOptionA.length < 3){this.$Message.error("选项A不能小于3字符");return false}
              if(singleData.singleOptionA.length > 250){this.$Message.error("选项A不能超过250字符");return false}

              if(!singleData.singleOptionB){this.$Message.error("选项B不能为空");return false}
              if(singleData.singleOptionB.length < 3){this.$Message.error("选项B不能小于3字符");return false}
              if(singleData.singleOptionB.length > 250){this.$Message.error("选项B不能超过250字符");return false}

              if(!singleData.singleOptionC){this.$Message.error("选项C不能为空");return false}
              if(singleData.singleOptionC.length < 3){this.$Message.error("选项C不能小于3字符");return false}
              if(singleData.singleOptionC.length > 250){this.$Message.error("选项C不能超过250字符");return false}

              if(!singleData.singleOptionD){this.$Message.error("选项D不能为空");return false}
              if(singleData.singleOptionD.length < 3){this.$Message.error("选项D不能小于3字符");return false}
              if(singleData.singleOptionD.length > 250){this.$Message.error("选项D不能超过250字符");return false}

              if(!singleData.singleAsk){this.$Message.error("答案不能为空");return false}
              //合并数据
              this.requestParams = Object.assign(this.questionObject,singleData);

            }else if(this.questionObject.type.includes("2")){
              this.requestParams = {};
              let mutipleData = this.mutiple.mutipleObject;

              if(!mutipleData.mutipleContent){this.$Message.error("多选题干不能为空");return false}
              if(mutipleData.mutipleContent.length < 3){this.$Message.error("多选题干不能小于3字符");return false}
              if(mutipleData.mutipleContent.length > 250){this.$Message.error("多选题干不能超过250字符");return false}

              if(!mutipleData.mutipleOptionA){this.$Message.error("选项A不能为空");return false}
              if(mutipleData.mutipleOptionA.length < 3){this.$Message.error("选项A不能小于3字符");return false}
              if(mutipleData.mutipleOptionA.length > 250){this.$Message.error("选项A不能超过250字符");return false}

              if(!mutipleData.mutipleOptionB){this.$Message.error("选项B不能为空");return false}
              if(mutipleData.mutipleOptionB.length < 3){this.$Message.error("选项B不能小于3字符");return false}
              if(mutipleData.mutipleOptionB.length > 250){this.$Message.error("选项B不能超过250字符");return false}

              if(!mutipleData.mutipleOptionC){this.$Message.error("选项C不能为空");return false}
              if(mutipleData.mutipleOptionC.length < 3){this.$Message.error("选项C不能小于3字符");return false}
              if(mutipleData.mutipleOptionC.length > 250){this.$Message.error("选项C不能超过250字符");return false}

              if(!mutipleData.mutipleOptionD){this.$Message.error("选项D不能为空");return false}
              if(mutipleData.mutipleOptionD.length < 3){this.$Message.error("选项D不能小于3字符");return false}
              if(mutipleData.mutipleOptionD.length > 250){this.$Message.error("选项D不能超过250字符");return false}

              if(!mutipleData.mutipleAsk){this.$Message.error('多选题答案不能为空');return false;}
              if(mutipleData.mutipleAsk.length == 1){this.$Message.error('至少两个选项');return false;}

              this.requestParams = Object.assign(this.questionObject,mutipleData);

            }else if(this.questionObject.type.includes("3")){
              this.requestParams = {};
              let askData = this.ask.askObject;

              if(!askData.askContent) {this.$Message.error('问答题干不能为空'); return false};
              if(askData.askContent.length < 3) {this.$Message.error('问答题干不能小于3字符'); return false};
              if(askData.askContent.length > 250) {this.$Message.error('问答题干不能超过250字符'); return false};

              this.requestParams = Object.assign(this.questionObject,askData);
            }else if(this.questionObject.type.includes("4")){

              let upperData = this.upper.upperObject;

              if(!upperData.upperContent) { this.$Message.error('上机题干不能为空');return false};
              if(upperData.upperContent.length < 3) { this.$Message.error('上机题干不能小于3个字符');return false};

              if(this.questionObject.id == null){
                if(!upperData.file){this.$Message.error('必须上传文件');return false}
              }

              this.requestParams = Object.assign(this.questionObject,upperData);
            }

            if(this.questionObject.type.includes("4")){
              this.upper.$refs['upload'].post(this.upper.upperObject.file);
            }else{
              saveOrUpdate(this.requestParams).then(res=>{
                res.data.code == 10000 ? this.$Message.success(res.data.message) : this.$Message.error(res.data.message);
                this.value = false;
                this.parent.getQuestionList(this.parent.params);
              });
            }

          }else{
            return false;
          }
        });
      },
      cancel(){
        this.styleValue = 'none';
        this.questionObject = {};
        this.lessionArray = [];
        this.companyArray = [];
        this.value = false;
      },
      typeChange(type){
        this.questionObject.type = type; //选中单选后,重新赋值
        this.single.singleObject = {};
        this.mutiple.mutipleObject = {};
        this.ask.askObject = {};
        this.upper.upperObject = {};
        switch (type) {
          case '1': //展示单选题
            this.single.singleStyle = 'block';
            this.mutiple.mutipleStyle = 'none';
            this.ask.askStyle = 'none';
            this.upper.upperStyle = 'none';
            break;
          case '2': //展示多选题
            this.single.singleStyle = 'none';
            this.mutiple.mutipleStyle = 'block';
            this.ask.askStyle = 'none';
            this.upper.upperStyle = 'none';
            break;
          case '3': //展示问答题
            this.single.singleStyle = 'none';
            this.mutiple.mutipleStyle = 'none';
            this.ask.askStyle = 'block';
            this.upper.upperStyle = 'none';
            break;
          case '4': //展示上机题
            this.single.singleStyle = 'none';
            this.mutiple.mutipleStyle = 'none';
            this.ask.askStyle = 'none';
            this.upper.upperStyle = 'block';
            break;
          default:
            this.single.singleStyle = 'none';
            this.mutiple.mutipleStyle = 'none';
            this.ask.askStyle = 'none';
            this.upper.upperStyle = 'none';
            break;
        }
      }
    },
    created(){
      this.styleValue = 'none';
      this.typeHiddenStyle = 'block';
      this.questionObject = {};
      this.lessionArray = [];
      this.companyArray = [];
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