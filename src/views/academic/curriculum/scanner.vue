<template>
  <div>
    <Split style="height: 900px" v-model="split">
      <div slot="left" :style="{display: hiddenTree,marginTop:'20px'}">
        <el-tree :data="chapterArray" :default-expand-all="true" :highlight-current="true" node-key="id" :render-content="renderContent"></el-tree>
      </div>

      <div slot="right">
        <Card :bordered="false" :dis-hover="true">
          <Table :columns="columns" :data="stageArray" :loading="loading" :border="true" @on-row-dblclick="dbClick"></Table>
        </Card>
      </div>
    </Split>

    <add-edit-genreal ref="addEditGenreal"></add-edit-genreal>

  </div>
</template>

<script>

  import { findGeneralByCode, findChapterByCodeAndStage } from '@/api/other/general';

  export default {
    name: 'curriculum',
    components:{
      AddEditGenreal:()=>import("@/views/other/general/add-edit-general.vue")
    },
    data(){
      return{
        split:0,
        hiddenTree:'none',
        stageId:null,
        stageArray:[],
        chapterArray:[],
        loading:true,
        params:{}
      }
    },
    computed:{
      columns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'name',title:'阶段名称',align:'center'},
          {key:'opt',title:'操作',align:'center',
            render(h, params) {
              return h('Button',{props:{type:'primary',icon:'md-cut',size:'small',disabled:!that.$access.has_permission('POINT-GENERAL-UPDATE')},on:{click(){
                that.saveWindow('addEditGenreal',params.row);
              }}},'修改阶段');
            },
            renderHeader(h, params) {
              return h('Button',{props:{type:'error',icon:'md-add',size:'small'},on:{click(){
                that.saveWindow('addEditGenreal',{code:'STAGE',pid:null})
                  }}},'添加阶段');
            }}
        ];
      }
    },
    watch:{
      chapterArray(value){
        if(value && value.length > 0){
          this.hiddenTree = "block";
          this.split = 0.2;
        }
      }
    },
    methods:{
      renderContent(h, { node, data, store }) { //章节tree数据
        if(data.pid == null){
          return (
              <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                  <span>{node.label}</span>
                </span>
                <span>
                  <el-button style="font-size: 12px;" type="text" on-click={ () => this.saveWindow('addEditGenreal',{code:'CHAPTER',pid:this.stageId}) }>添加课程</el-button>
                </span>
              </span>
        );
        }else{
          let {id,pid,code,label,description} = data;
          let name = label;
          data = {id,name,pid,code,description};
          return (
              <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                  <span>{node.label}</span>
                </span>

                <span>
                  <el-button style="font-size: 12px;" type="text" on-click={ () => this.saveWindow('addEditGenreal',data) }>修改课程</el-button>
                </span>
              </span>

        );
        }
      },
      dbClick(row){ //双击课程记录加载阶段列表
        findChapterByCodeAndStage({"code":"CHAPTER",stageId:row.id}).then(res=>{
          this.stageId = row.id;
          this.chapterArray = res.data.data;
        })
      },
      getGeneralList(){
        findGeneralByCode({"code":'STAGE'}).then(res=>{
          this.stageArray = res.data.data;
          this.loading = false;
        });
      },
      saveWindow(name,data){ //添加课程
        console.log(data);
        this.$refs[name].generalObject = {};
        if(data.id){
          this.$refs[name].generalObject = data;
        }

        this.$refs[name].generalObject.pid = data.pid;
        this.$refs[name].generalObject.code = data.code;



        this.$refs[name].value = true;
      }
    },
    created(){
      this.stageId = null;
      this.chapterArray = [];
      this.hiddenTree = "none";
      this.getGeneralList();
    }
  };
</script>

<style scoped>

</style>
