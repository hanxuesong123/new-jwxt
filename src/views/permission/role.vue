<template>
  <div>
    <self-table :params="params" :data="roleArray" :columns="roleColumns" :list="getRoleList" :loading="loading"></self-table>

    <add-edit-role ref="addEditRole"></add-edit-role>
    <access-permission ref="accessPermission"></access-permission>
  </div>
</template>

<script>

  import { list } from '@/api/permission/role';

  export default {
    name: 'role',
    components:{
      AddEditRole:()=>import("@/views/permission/child/add-edit-role.vue"),
      AccessPermission:()=>import("@/views/permission/child/access-permission.vue")
    },
    data(){
      return {
        roleArray:[],
        params:{page:1,size:10,total:0},
        loading:true
      }
    },
    computed:{
      roleColumns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'name',title:'角色名称',align:'center'},
          {key:'description',title:'角色描述',align:'center'},
          {key:'opt',title:'操作',align:'center',
            render(h,params){
              return h('span',[
                h('Button',{props:{icon:'md-cut',type:'primary',size:'small',ghost:true,disabled:!that.$access.has_permission('POINT-ROLE-UPDATE')},style:{marginRight:'5px'},on:{click(){
                      that.openWindow('addEditRole',params.row);
                    }}},'修改角色'),
                h('Button',{props:{icon:'md-cut',type:'primary',size:'small',ghost:true,disabled:!that.$access.has_permission('POINT-ACCESS-ROLE-PERMISSION')},style:{marginRight:'5px'},on:{click(){
                      that.openAccessWindow('accessPermission',params.row);
                    }}},'分配权限'),
              ],'');
            },
            renderHeader(h,params){
              return h('Button',{props:{type:'error',ghost:true,size:'small',icon:'md-add',disabled:!that.$access.has_permission('POINT-ROLE-ADD')},on:{click(){
                    that.openWindow('addEditRole',null);
                  }}},'添加角色');
            }}
        ];
      }
    },
    methods:{
      getRoleList(data){
        list(data).then(res=>{
          if(res && res.data && res.data.data){
            list(data).then(res=>{
              this.params.total = res.data.data.total;
              this.roleArray = res.data.data.rows;
            })
          }else{
            this.roleArray = [];
          }
          this.loading = false;
        })
      },
      openWindow(name,data){
        if(data == null) this.$refs[name].roleObject = {};
        else this.$refs[name].roleObject = data;
        this.$refs[name].value = true;
      },
      openAccessWindow(name,data){
        this.$refs[name].roleObject = data;
        this.$refs[name].value = true;
      }
    },
    created(){
      this.getRoleList(this.params);
    }
  };
</script>

<style scoped>

</style>
