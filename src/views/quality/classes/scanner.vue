<template>
  <div>

    <Card :bordered="false" :dis-hover="true">
      <template slot="title">
        <span v-if="validate.point.query">
          <Input placeholder="请输入班级名称" style="width: 200px;margin-right: 5px" v-model="params.className" />

          <Select placeholder="请选择所属阶段"  v-model="params.lessionId" :clearable="true" :filterable="true" style="width: 200px;margin-right: 5px">
            <Option :value="item.id" v-for="item in stageArray" :key="item.id">{{item.name}}</Option>
          </Select>

          <DatePicker type="date" v-model="params.startTime"  :clearable="true"  placeholder="请选择开班时间" style="width: 200px;margin-right: 5px"></DatePicker>
          <DatePicker type="date" v-model="params.endTime"  :clearable="true" placeholder="请选择毕业时间" style="width: 200px;margin-right: 5px"></DatePicker>

          <Select filterable v-model="params.nickName" placeholder="请选择带班教师" :clearable="true" style="width: 200px;margin-right: 5px">
            <Option :value="item.nickName" v-for="item in teacherArray" :key="item.id">{{item.nickName}}</Option>
          </Select>
          <Button type="primary"  icon="ios-search" :style="{width: '100px',marginRight: '5px'}" @click="getClassesList(params)">查询数据</Button>
          <Button type="primary"  icon="md-refresh" :style="{width: '100px',marginRight: '5px'}" @click="params={page:1,size:20},getClassesList(params)">重置查询</Button>
        </span>
        <Button type="primary"  icon="md-add" :style="{display:validate.point.add ? 'inlineBlock':'none',width: '100px'}"  @click="openWindow('addEditClasses',null)">新增班级</Button>
        <div style="color:lightslategray;margin-top: 10px">
          <span >*注: 查询时间时,是查询的当前选中月的前后月 例如:选中的是7月,则查询6,7,8月的数据</span>
        </div>
      </template>
      <self-table :list="getClassesList" :data="classesArray" :columns="columns" :loading="loading" :params="params"></self-table>
    </Card>

    <add-edit-classes ref="addEditClasses"></add-edit-classes>
  </div>
</template>

<script>

  import { getClassesList } from '@/api/quality/classes';
  import { formatTime } from '@/utils/tools';
  import { findGeneralByCode } from "@/api/other/general";
  import { findTeachers } from '@/api/permission/user';
  export default {
    name: 'scanner',
    components:{
      AddEditClasses:()=>import("@/views/quality/child/add-edit-classes.vue")
    },
    data(){
      return{
        loading:true,
        params:{page:1,size:10,total:0},
        classesArray:[],
        stageArray:[],
        teacherArray:[],
        validate:{
          api:{
            list: this.$access.has_api_permission('API-CLASSES-API')
          },
          point:{
            add: this.$access.has_permission("POINT-CLASSES-ADD"),
            update:this.$access.has_permission("POINT-CLASSES-UPDATE"),
            query: this.$access.has_permission('POINT-CLASSES-LIST')
          }
        }
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
            render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',size:'small',ghost:true,icon:'md-cut'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click() {
                      that.openWindow('addEditClasses',params.row);
                    }}},'修改'),
              ],'');
            }}
        ];
      }
    },
    created(){
      if(this.validate.api.list){
        this.getClassesList(this.params);
        findGeneralByCode({"code":"STAGE"}).then(res=>{this.stageArray = res.data.data});
        findTeachers().then(res=>this.teacherArray = res.data.data);
      }

    }
  };
</script>

<style scoped>

</style>
