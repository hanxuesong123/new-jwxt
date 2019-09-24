<template>
  <div>

    <Card>
      <template slot="title">
        <span v-if="validate.point.query">
          <Button style="margin-right: 5px" type="primary" icon="md-refresh" @click="openSearchWindow('searchUser')">条件查询</Button>
          <Button style="margin-right: 5px" type="primary" icon="md-add" @click="params={page:1,size:10,total:0},getTeacherList(params)">重置查询</Button>
        </span>
        <Button :style="{display:validate.point.add ? 'inlineBlock':'none',width: '100px',marginRight: '5px'}" type="primary" icon="md-add" @click="openWindow('addEditUser',null)">添加教师</Button>
      </template>
      <self-table :params="params"  :validate="validate.api.list" :list="getTeacherList" :data="teacherArray" :columns="teacherColumns" :loading="loading"></self-table>
    </Card>

    <add-edit-user ref="addEditUser"></add-edit-user>
    <access-role ref="accessRole"></access-role>
    <search-user ref="searchUser" :parent="this"></search-user>
  </div>
</template>

<script>

  import { formatTime } from '@/utils/tools';

  import { getTeacherList } from '@/api/permission/user';


  export default {
    name: 'user',
    components:{
      AddEditUser:()=>import("@/views/permission/child/add-edit-user.vue"),
      AccessRole:()=>import("@/views/permission/child/access-role.vue"),
      SearchUser:()=>import("@/views/permission/child/search-user.vue")
    },
    data(){
      return{
        params:{page:1,size:20,total:0},
        loading:true,
        teacherArray:[],
        validate:{
          api:{
            list:this.$access.has_api_permission("API-USER-LIST"),
          },
          point:{
            add:this.$access.has_permission("POINT-USER-ADD"),
            access:this.$access.has_permission("POINT-ROLE-USER-ACCESS"),
            query:this.$access.has_permission("POINT-USER-LIST")
          }
        }
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
              return h('Button',{props:{type:'primary',ghost:true,icon:'md-add',size:'small'},style:{marginRight:'5px',display:that.validate.point.access ? 'inlineBlock':'none' },on:{click(){
                    that.assessRole('accessRole',params.row);
                  }}},'分配角色');
            }}
        ];
      }
    },
    methods:{
      openSearchWindow(name){
        this.params = {page:1,size:20,total:0};
        this.$refs[name].value = true;
      },
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
      if(this.validate.api.list){
        this.getTeacherList(this.params);
      }
    }
  };
</script>

<style scoped>

</style>
