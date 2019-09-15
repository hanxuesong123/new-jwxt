<template>
  <div>
    <Card :bordered="false" :dis-hover="true">
      <RadioGroup type="button" v-model="params.type" @on-change="radioChange">
        <Radio label="1">单选题</Radio>
        <Radio label="2">多选题</Radio>
        <Radio label="3">问答题</Radio>
        <Radio label="4">上机题</Radio>
      </RadioGroup>
      <Button type="primary" icon="md-add" style="margin: 0px 5px 0px 5px" @click="openWindow('addEditQuestion',null)">新增试题</Button>
    </Card>
    <Card :bordered="false" :dis-hover="true">
      <self-table :params="params" :loading="loading" :list="getQuestionList" :data="questionArray" :columns="columns"></self-table>
    </Card>

    <add-edit-question ref="addEditQuestion"></add-edit-question>

  </div>
</template>

<script>

  import { list } from '@/api/academic/questions';

  export default {
    name: 'question',
    components:{
      AddEditQuestion:()=>import("@/views/academic/child/add-edit-question.vue")
    },
    data(){
      return{
        loading:true,
        questionArray:[],
        params:{page:1,size:20,total:0,type:'1'}
      }
    },
    methods:{
      getQuestionList(data){
        list(data).then(res=>{
          this.params.total = res.data.data.total;
          this.questionArray = res.data.data.rows;
          this.loading = false;
        })
      },
      radioChange(data){
        this.params.type = data;
        this.getQuestionList(this.params);
      },
      openWindow(name,data){
        if(data == null){
          this.$refs[name].questionObject = {};
          this.$refs[name].questionObject.type = null;
          this.$refs[name].$refs['ask'].askObject = {};
          this.$refs[name].$refs['single'].singleObject = {};
          this.$refs[name].$refs['mutiple'].mutipleObject = {};
          this.$refs[name].$refs['upper'].upperObject = {};
        } else{
          this.$refs[name].questionObject = data;
          this.$refs[name].totalObject = data;
        }
        this.$refs[name].value = true;
      }
    },
    computed:{
      columns(){
        let that = this;
        if(this.params.type == '1'){
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
                 h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px'},on:{click(){
                   that.openWindow("addEditQuestion",params.row);
                     }}},'修改'),
                  h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},on:{click(){
                    alert("b")
                      }}},'启禁')
                ],'');
              }}
          ];
        }else if(this.params.type == '2'){
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
                  h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px'},on:{click(){
                        that.openWindow("addEditQuestion",params.row);
                      }}},'修改'),
                  h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},on:{click(){
                        alert("b")
                      }}},'启禁')
                ],'');
              }}
          ];
        }else if(this.params.type == '3'){
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
                  h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px'},on:{click(){
                        that.openWindow("addEditQuestion",params.row);
                      }}},'修改'),
                  h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},on:{click(){
                        alert("b")
                      }}},'启禁')
                ],'');
              }}
          ];
        }else if(this.params.type == '4'){
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
                return h('Button',{props:{ghost:true,type:'primary',size:'small'},style:{color:'blank'},on:{click(){
                      that.$Modal.confirm({
                        title:'友情提示',
                        content:`确定要下载资源吗?`,
                        onOk:()=>{
                          alert("A")
                        }
                      })
                    }}},'下载');
              }},
            {key:'upperStatus',title:'启禁',align:'center',render(h,params){
                return h('Tag',{ props:{color:params.row.upperStatus == '1' ? 'success':'error'} },params.row.upperStatus == '1' ? '启用':'禁用');
              }},
            {key:'opt',title:"操作",align:'center',render(h,params){
                return h('span',[
                  h('Button',{props:{type:'primary',size:'small',icon:'md-cut',ghost:true},style:{marginRight:'5px'},on:{click(){
                        that.openWindow("addEditQuestion",params.row);
                      }}},'修改'),
                  h('Button',{props:{type:'primary',size:'small',icon:'ios-hammer',ghost:true},on:{click(){
                        alert("b")
                      }}},'启禁')
                ],'');
              }}
          ];
        }
      }
    },
    created(){
      this.getQuestionList(this.params);
    }
  };
</script>

<style scoped>

</style>
