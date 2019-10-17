<template>
  <div>
    <Card :bordered="false" :dis-hover="true">
      <template slot="title">
       <span v-if="validate.point.query">
         <RadioGroup v-model="params.type" type="button" style="margin-right: 5px" @on-change="radioChange">
            <Radio label="1">单选题</Radio>
            <Radio label="2">多选题</Radio>
            <Radio label="3">问答题</Radio>
            <Radio label="4">上机题</Radio>
          </RadioGroup>

         <Button type="primary" icon="ios-search" style="margin-right: 5px" @click="params={page:1,size:20,total:0,type:'1'},value=true">条件查询</Button>
         <Button type="primary" icon="md-refresh" style="margin-right: 5px" @click="loading = true,params={page:1,size:20,total:0,type:'1'},getQuestionList(params)">重置查询</Button>

       </span>
          <Button type="primary" icon="md-add"  :style="{display:validate.point.add ? 'inlineBlock' : 'none'}"  @click="openWindow('addEditQuestion',null)">新增试题</Button>
      </template>



      <Drawer v-model="value" title="条件查询" :width="500" :closable="true">

        <RadioGroup v-model="params.type" type="button" style="margin-bottom: 20px">
          <Radio label="1">单选题</Radio>
          <Radio label="2">多选题</Radio>
          <Radio label="3">问答题</Radio>
          <Radio label="4">上机题</Radio>
        </RadioGroup>

        <Input  type="text" placeholder="请输入题干" v-model="params.content" style="margin-bottom: 20px"/>

        <Select v-model="params.lessionId" :clearable="true" :filterable="true" placeholder="请选择课程" style="margin-bottom: 20px">
          <OptionGroup :key="general.id" v-for="general in lessionArray" :label="general.general.name">
              <Option :value="item.id" :key="item.id" v-for="item in general.children">{{item.name}}</Option>
          </OptionGroup>
        </Select>

        <Select v-model="params.discipline" :clearable="true" :filterable="true" style="margin-bottom: 20px" placeholder="请选择学科">
          <Option :value="'1'">软件</Option>
          <Option :value="'2'">网络</Option>
        </Select>

        <Select v-model="params.sourced" :clearable="true" :filterable="true" style="margin-bottom: 20px" placeholder="请选择来源">
          <Option :value="'1'">课程试题</Option>
          <Option :value="'2'">面试宝典</Option>
          <Option :value="'3'">企业真题</Option>
        </Select>

          <Select v-model="params.companyId" :clearable="true" :filterable="true" style="margin-bottom: 20px" placeholder="请选择企业">
              <Option :value="item.id" :key="item.id" v-for="item in companyArray">{{item.name}}</Option>
          </Select>

        <Button @click="getQuestionList(params)" type="primary">查询</Button>
      </Drawer>



      <self-table :list="getQuestionList" :validate="true" :params="params" :data="questionArray" :columns="columns" :loading="loading"></self-table>

      <add-edit-question ref="addEditQuestion" :parent="this"></add-edit-question>

    </Card>
  </div>
</template>
<script>

  import { findGenerals } from "@/api/other/general";
  import { list,opt } from "@/api/academic/questions";
  import { findCompanys } from "@/api/job/company";
  export default {
    name:'question',
    components:{
      AddEditQuestion:()=>import("@/views/academic/child/add-edit-question.vue")
    },
    data(){
      return {
        params:{page:1,size:20,total:0,type:'1'},
        loading:true,
        value:false,
        questionArray:[],
        lessionArray:[],
        companyArray:[],
        validate:{
          api:{
            list:this.$access.has_api_permission('API-QUESTION-LIST')
          },
          point:{
            query:this.$access.has_permission('POINT-QUESTION-LIST'),
            add:this.$access.has_permission('POINT-QUESTION-ADD'),
            update:this.$access.has_permission('POINT-QUESTION-UPDATE'),
            opt:this.$access.has_permission('POINT-QUESTION-OPT'),
            download:this.$access.has_permission('POINT-QUESTION-DOWNLOAD')
          }
        }
      }
    },
    watch:{
        value(data){
            if(data){
                findGenerals().then(res=>this.lessionArray = res.data.data);
            }
        },
        'params.sourced'(data){
            if(data && data == '3'){
                findCompanys().then(res=>this.companyArray = res.data.data);
            }
        }
    },
    methods:{
      openWindow(name,data){
        if(data == null){
            this.$refs[name].questionObject = {};
            this.$refs[name].questionObject.type = null;
            this.$refs[name].$refs['ask'].askObject = {};
            this.$refs[name].$refs['single'].singleObject = {};
            this.$refs[name].$refs['mutiple'].mutipleObject = {};
            this.$refs[name].$refs['upper'].upperObject = {};
        }else{
            let s1 = data.upperStatus;
            let s2 = data.singleStatus;
            let s3 = data.mutipleStatus;
            let s4 = data.askStatus;

            if(s1 && s1 === '2'){ this.$Message.error("禁用数据无法修改");return false };
            if(s2 && s2 === '2'){ this.$Message.error("禁用数据无法修改");return false };
            if(s3 && s3 === '2'){ this.$Message.error("禁用数据无法修改");return false };
            if(s4 && s4 === '2'){ this.$Message.error("禁用数据无法修改");return false };

            this.$refs[name].questionObject = data;//子类数据
            this.$refs[name].totalObject = data; //孙类数据
        }
        this.$refs[name].value = true;

      },
      radioChange(data){
        this.loading = true;
        this.params.type = data;
        this.getQuestionList(this.params);
      },
      getQuestionList(data){
        list(data).then(res=>{
          this.questionArray = res.data.data.rows;
          this.params.total = res.data.data.total;
          this.loading = false;
        });
      },
      opt(id){
        this.$Modal.confirm({
            title:'友情提示',
            content:`确定该操作吗?`,
            onOk:()=>{
                opt(id).then(res=>{
                    if(res.data.code === 10000){
                        this.$Message.success(res.data.message);
                    }else{
                        this.$Message.error(res.data.message);
                    }
                    this.getQuestionList(this.params);
                })
            }
        })
      }
    },
    computed:{
      columns(){
        let that = this;

        if(this.params.type == '1'){//单选题的表头
                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'discipline',title:'学科',align:'center',render:(h,params)=>{
                            return h('Tag',{props:{color:params.row.discipline == '1' ? 'blue':'green'}},params.row.discipline == '1' ? '软件' : '网络');
                        }},
                    {key:'lessionName',title:'课程',align:'center'},
                    {key:'sourced',title:'来源',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.sourced == '1' ? '课程试题' : (params.row.sourced == '2' ? '面试宝典':'企业真题'));
                        }},
                    {key:'companyName',title:'企业',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.companyId == null ? "/" : params.row.companyName);
                        }},
                    {key:'type',title:"题型",align:'center',render(h,params){
                            return h('span',{},params.row.type == '1' ? '单选题' : (params.row.type == '2' ? '多选题': (params.row.type == '3') ? "问答题" : "上机题"));
                        }},
                    {key:'singleContent',title:'题干',align:'center',ellipsis:true},
                    {key:'singleStatus',title:'启禁',align:'center',render(h,params){
                            return h('Tag',{ props:{color:params.row.singleStatus == '1' ? 'success':'error'} },params.row.singleStatus == '1' ? '启用':'禁用');
                        }},
                    {key:'opt',title:"操作",align:'center',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
                                            that.openWindow("addEditQuestion",params.row);
                                        }}},'修改'),
                                h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},style:{marginRight:'5px',display:that.validate.point.opt ? 'inlineBlock':'none' },on:{click(){
                                            that.opt(params.row.id)
                                        }}},'启禁')
                            ],'');
                        }}
                ];
        }else if(this.params.type == '2'){//多选题的表头
                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'discipline',title:'学科',align:'center',render:(h,params)=>{
                            return h('Tag',{props:{color:params.row.discipline == '1' ? 'blue':'green'}},params.row.discipline == '1' ? '软件' : '网络');
                        }},
                    {key:'lessionName',title:'课程',align:'center'},
                    {key:'sourced',title:'来源',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.sourced == '1' ? '课程试题' : (params.row.sourced == '2' ? '面试宝典':'企业真题'));
                        }},
                    {key:'companyName',title:'企业',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.companyId == null ? "/" : params.row.companyName);
                        }},
                    {key:'type',title:"题型",align:'center',render(h,params){
                            return h('span',{},params.row.type == '1' ? '单选题' : (params.row.type == '2' ? '多选题': (params.row.type == '3') ? "问答题" : "上机题"));
                        }},
                    {key:'mutipleContent',title:'题干',align:'center',ellipsis:true},
                    {key:'mutipleStatus',title:'启禁',align:'center',render(h,params){
                            return h('Tag',{ props:{color:params.row.mutipleStatus == '1' ? 'success':'error'} },params.row.mutipleStatus == '1' ? '启用':'禁用');
                        }},
                    {key:'opt',title:"操作",align:'center',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
                                            that.openWindow("addEditQuestion",params.row);
                                        }}},'修改'),
                                h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},style:{marginRight:'5px',display:that.validate.point.opt ? 'inlineBlock':'none' },on:{click(){
                                            that.opt(params.row.id)
                                        }}},'启禁')
                            ],'');
                        }}
                ];
        }else if(this.params.type == '3'){//问答题的表头

                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'discipline',title:'学科',align:'center',render:(h,params)=>{
                            return h('Tag',{props:{color:params.row.discipline == '1' ? 'blue':'green'}},params.row.discipline == '1' ? '软件' : '网络');
                        }},
                    {key:'lessionName',title:'课程',align:'center'},
                    {key:'sourced',title:'来源',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.sourced == '1' ? '课程试题' : (params.row.sourced == '2' ? '面试宝典':'企业真题'));
                        }},
                    {key:'companyName',title:'企业',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.companyId == null ? "/" : params.row.companyName);
                        }},
                    {key:'type',title:"题型",align:'center',render(h,params){
                            return h('span',{},params.row.type == '1' ? '单选题' : (params.row.type == '2' ? '多选题': (params.row.type == '3') ? "问答题" : "上机题"));
                        }},
                    {key:'askContent',title:'题干',align:'center',tooltip:true},
                    {key:'askStatus',title:'启禁',align:'center',render(h,params){
                            return h('Tag',{ props:{color:params.row.askStatus == '1' ? 'success':'error'} },params.row.askStatus == '1' ? '启用':'禁用');
                        }},
                    {key:'opt',title:"操作",align:'center',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
                                            that.openWindow("addEditQuestion",params.row);
                                        }}},'修改'),
                                h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},style:{marginRight:'5px',display:that.validate.point.opt ? 'inlineBlock':'none' },on:{click(){
                                            that.opt(params.row.id)
                                        }}},'启禁')
                            ],'');
                        }}
                ];
        }else if(this.params.type == '4'){//上机题的表头
                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'discipline',title:'学科',align:'center',render:(h,params)=>{
                            return h('Tag',{props:{color:params.row.discipline == '1' ? 'blue':'green'}},params.row.discipline == '1' ? '软件' : '网络');
                        }},
                    {key:'lessionName',title:'课程',align:'center'},
                    {key:'sourced',title:'来源',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.sourced == '1' ? '课程试题' : (params.row.sourced == '2' ? '面试宝典':'企业真题'));
                        }},
                    {key:'companyName',title:'企业',align:'center',render:(h,params)=>{
                            return h('span',{},params.row.companyId == null ? "/" : params.row.companyName);
                        }},
                    {key:'type',title:"题型",align:'center',render(h,params){
                            return h('span',{},params.row.type == '1' ? '单选题' : (params.row.type == '2' ? '多选题': (params.row.type == '3') ? "问答题" : "上机题"));
                        }},
                    {key:'upperContent',title:'题干',align:'center',tooltip:true},
                    {key:'downResources',title:'资源',align:'center',render(h,params){
                            return h('a',{props:{disabled: !that.validate.point.download},on:{click(){
                                        if(params.row.upperUrl){
                                            that.$Modal.confirm({
                                                title:'友情提示',
                                                content:'确定要下载吗?',
                                                onOk(){
                                                    window.location.href = params.row.upperUrl;
                                                }
                                            })

                                        }else{
                                            that.$Message.error("没有可供下载的资源");
                                            return false;
                                        }

                                    }}},'下载');
                        }},
                    {key:'upperStatus',title:'启禁',align:'center',render(h,params){
                            return h('Tag',{ props:{color:params.row.upperStatus == '1' ? 'success':'error'} },params.row.upperStatus == '1' ? '启用':'禁用');
                        }},
                    {key:'opt',title:"操作",align:'center',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
                                            that.openWindow("addEditQuestion",params.row);
                                        }}},'修改'),
                                h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},style:{marginRight:'5px',display:that.validate.point.opt ? 'inlineBlock':'none' },on:{click(){
                                            that.opt(params.row.id)
                                        }}},'启禁')
                            ],'');
                        }}
                ];
        }
      }
    },
    created(){
      if(this.validate.api.list){
        this.getQuestionList(this.params);
      }
    }
  }
</script>
<style scoped></style>