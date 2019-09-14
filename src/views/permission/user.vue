<template>
  <div>
    <self-table :params="params" :list="getTeacherList" :data="teacherArray" :columns="teacherColumns" :loading="loading"></self-table>

    <add-edit-user ref="addEditUser"></add-edit-user>
    <access-role ref="accessRole"></access-role>

  </div>
</template>

<script>

  import { formatTime } from '@/utils/tools';

  import { getTeacherList } from '@/api/permission/user';


  export default {
    name: 'user',
    components:{
      AddEditUser:()=>import("@/views/permission/child/add-edit-user.vue"),
      AccessRole:()=>import("@/views/permission/child/access-role.vue")
    },
    data(){
      return{
        params:{page:1,size:10,total:0},
        loading:true,
        teacherArray:[]
      }
    },
    computed:{
      teacherColumns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center',width:'60px'},
          {key:'nickName',title:'教师姓名',align:'center',width:'100px'},
          {key:'telephone',title:'电话',align:'center',tooltip:true},
          {key:'email',title:'邮件',align:'center',tooltip:true},
          {key:'jobTitle',title:'职位名称',align:'center',width:'100px'},
          {key:'entryTime',title:'入职时间',align:'center',render(h,params){
              return h('span',{},formatTime(params.row.entryTime));
            }},
          {key:'hasLeave',title:'是否离职',align:'center',width:'100px',render(h,params){
              return h('span',{style:{color:params.row.hasLeave == 1? 'green':'red'}},params.row.hasLeave == 1? '在职':'离职');
            }},
          {key:'status',title:'是否启禁',align:'center',width:'100px',render(h,params){
              return h('span',{style:{color:params.row.status == 1? 'green':'red'}},params.row.status == 1? '启用':'禁用');
            }},
          {key:'opt',title:'操作',align:'center',
            render(h,params){
              return h('Button',{props:{type:'primary',ghost:true,icon:'md-add',size:'small',disabled:!that.$access.has_permission('POINT-ROLE-USER-ACCESS')},on:{click(){
                    that.assessRole('accessRole',params.row);
                  }}},'分配角色');
            },
            renderHeader(h,params){
              return h('Button',{props:{type:'error',ghost:true,icon:'md-add',size:'small',disabled:!that.$access.has_permission('POINT-USER-ADD')},on:{click(){
                    that.openWindow('addEditUser',params.row);
                  }}},'添加教师');
            }}
        ];
      }
    },
    methods:{
      assessRole(name,user){
        if(user.status == '2'){
          this.$Message.error("禁用用户无法分配角色");
          return false;
        }
        if(user.hasLeave == '2'){
          this.$Message.error("离职用户无法分配角色");
          return false;
        }
        this.$refs[name].userObject = user;
        this.$refs[name].value = true;
      },
      openWindow(name,data){
        if(data == null) this.$refs[name].teacherObject = {};
        else this.$refs[name].teacherObject = data;
        this.$refs[name].value = true;
      },
      getTeacherList(data){
        getTeacherList(data).then(res=>{
          this.teacherArray = res.data.data.rows;
          this.params.total = res.data.data.total;
          this.loading = false;
        })
      }
    },
    created(){
      this.getTeacherList(this.params);
    }
  };
</script>

<style scoped>

</style>
