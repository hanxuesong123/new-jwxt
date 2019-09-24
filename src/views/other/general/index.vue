<template>
  <div>

    <Card :bordered="false" :dis-hover="true">
      <template slot="title">
        <span v-if="validate.point.query">
          <Input type="text" v-model="params.name" placeholder="请输入名称" style="width: 200px;margin-right: 5px" />
          <Input type="text" v-model="params.code" placeholder="请输入代码" style="width: 200px;margin-right: 5px" />
          <Select clearable v-model="params.status" placeholder="请选择状态" style="width: 200px;margin-right: 5px">
            <Option :value="1">启用</Option>
            <Option :value="2">禁用</Option>
          </Select>
          <Button type="primary"  icon="ios-search" :style="{width: '100px',marginRight: '5px'}" @click="getGeneralList(params)">查询数据</Button>
          <Button type="primary"  icon="md-refresh" :style="{width: '100px',marginRight: '5px'}" @click="params={page:1,size:20},getGeneralList(params)">重置查询</Button>
        </span>
        <Button type="primary"  icon="md-add" :style="{display:validate.point.add ? 'inlineBlock':'none',width: '100px'}"  @click="openWindow('addEditGenreal',null)">新增字典</Button>
      </template>
      <self-table :params="params" :validate="validate.api.list" :list="getGeneralList" :loading="loading" :data="generalArray" :columns="columns"></self-table>
    </Card>

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
        generalArray:[],
        validate:{
          point:{
            add:this.$access.has_permission('POINT-GENERAL-ADD'),
            query:this.$access.has_permission('POINT-GENERAL-LIST'),
            opt:this.$access.has_permission('POINT-GENERAL-OPT'),
            update:this.$access.has_permission('POINT-GENERAL-UPDATE')
          },
          api:{
            list:this.$access.has_api_permission('API-GENERAL-LIST')
          }
        }
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
              return h('Tag',{ props:{color:params.row.status == '1' ? 'primary':'error'} },params.row.status == '1' ? '启用':'禁用');
            }},
          {key:'opt',title:'操作',align:'center',render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',icon:'ios-hammer',size:'small',ghost:true},style:{marginRight:'5px',display:that.validate.point.opt ? 'inlineBlock':'none' },on:{click(){
                      that.opt(params.row)
                    }}},'启禁'),
                h('Button',{props:{type:'primary',icon:'md-cut',size:'small',ghost:true},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
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
      if(this.validate.api.list){
        this.getGeneralList(this.params);
      }
    }
  };
</script>

<style scoped>

</style>
