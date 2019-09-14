<template>
  <div>
    <self-table :params="params" :list="getGeneralList" :loading="loading" :data="generalArray" :columns="columns"></self-table>
    <add-edit-genreal ref="addEditGenreal"></add-edit-genreal>
  </div>
</template>

<script>

  import { list,opt } from '@/api/other/general';

  export default {
    name: 'general',
    components:{
      AddEditGenreal:()=>import("@/views/other/general/add-edit-general.vue")
    },
    data(){
      return {
        loading:true,
        params:{page:1,size:20,total:0},
        generalArray:[]
      }
    },
    computed:{
      columns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'name',title:'名称',align:'center'},
          {key:'code',title:'代码',align:'center'},
          {key:'description',title:'描述',align:'center'},
          {key:'status',title:'启禁',align:'center',render(h,params){
              return h('Tag',{ props:{color:params.row.status == '1' ? 'success':'error'} },params.row.status == '1' ? '启用':'禁用');
            }},
          {key:'opt',title:'操作',align:'center',renderHeader(h,params){
              return h('Button',{props:{type:'success',size:'small',icon:'md-add',ghost:true},on:{click(){
                    that.openWindow('addEditGenreal',null);
                  }}},'添加字典');
            },render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',icon:'ios-hammer',size:'small',ghost:true},style:{marginRight:'5px'},on:{click(){
                      that.opt(params.row)
                    }}},'启禁'),
                h('Button',{props:{type:'primary',icon:'md-cut',size:'small',ghost:true},on:{click(){
                      that.openWindow('addEditGenreal',params.row);
                    }}},'修改')
              ],'');
            }}
        ];
      }
    },
    methods:{
      getGeneralList(data){
        list(data).then(res=>{
          this.generalArray = res.data.data.rows;
          this.params.total = res.data.data.total;
          this.loading = false;
        })
      },
      openWindow(name,data){
        if(data == null) this.$refs[name].generalObject = {};
        else this.$refs[name].generalObject = data;
        this.$refs[name].value = true;
      },
      opt(data){
        if(data){
          this.$Modal.confirm({
            title:'友情提示',
            content:`${data.status == '1' ? '禁用吗?' : "启用吗?"}`,
            onOk:()=>{
              this.loading = true;
              opt(data).then(res=>{
                if(res.data.code === 10000){
                  this.$Message.success(res.data.message);
                }else{
                  this.$Message.error(res.data.message);
                }
                this.loading = false;
                this.getGeneralList(this.params);
              })
            }
          })
        }
      }
    },
    created(){
      this.getGeneralList(this.params);
    }
  };
</script>

<style scoped>

</style>
