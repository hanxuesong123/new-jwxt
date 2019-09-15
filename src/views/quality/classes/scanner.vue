<template>
  <div>
    <self-table :list="getClassesList" :data="classesArray" :columns="columns" :loading="loading" :params="params"></self-table>
    <add-edit-classes ref="addEditClasses"></add-edit-classes>
  </div>
</template>

<script>

  import { getClassesList } from '@/api/quality/classes';
  import { formatTime } from '@/utils/tools';

  export default {
    name: 'scanner',
    components:{
      AddEditClasses:()=>import("@/views/quality/child/add-edit-classes.vue")
    },
    data(){
      return{
        loading:true,
        params:{page:1,size:10,total:0},
        classesArray:[]
      }
    },
    methods:{
      getClassesList(data){
        getClassesList(data).then(res=>{
          this.classesArray = res.data.data.rows;
          this.params.total = res.data.data.total;
          this.loading = false;
        })
      },
      openWindow(name,data){
        if(data == null) this.$refs[name].classesObject = {};
        else this.$refs[name].classesObject = data;
        this.$refs[name].value = true;
      },
    },
    computed:{
      columns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'className',title:'班级名称',align:'center'},
          {key:'generalName',title:'所属阶段',align:'center'},
          {key:'personNumber',title:'班级人数',align:'center'},
          {key:'startTime',title:'开班时间',align:'center',render(h,params){
            return h('span',{},formatTime(params.row.startTime));
            }},
          {key:'endTime',title:'毕业时间',align:'center',render(h,params){
              return h('span',{},formatTime(params.row.startTime));
            }},
          {key:'teachers',title:'带班教师',align:'center'},
          {key:'opt',title:'操作',align:'center',
            renderHeader(h,params){
              return h('Button',{props:{type:'primary',size:'small',ghost:true,icon:'md-add',disabled:!that.$access.has_permission("POINT-CLASSES-ADD")},on:{click(){
                    that.openWindow('addEditClasses',null);
              }}},'新增班级');
            },
            render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',size:'small',ghost:true,icon:'md-cut',disabled:!that.$access.has_permission("POINT-CLASSES-UPDATE")},on:{click() {
                      that.openWindow('addEditClasses',params.row);
                    }}},'修改'),
              ],'');
            }}
        ];
      }
    },
    created(){
      this.getClassesList(this.params);
    }
  };
</script>

<style scoped>

</style>
