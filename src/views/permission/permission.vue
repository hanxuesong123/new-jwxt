<template>
  <div>
    <Row>
      <Col :span="24">
        <!--顶级菜单-->
        <Card :bordered="false" :dis-hover="true" style="height: 350px;margin: 10px">
          <self-table :data="permissionArray" :validate="validate.api.list" :columns="permissionColumns" :params="params" :loading="loading" :list="getPermissionList"></self-table>
        </Card>
      </Col>
    </Row>
    <Row :style="{display:styleValue}">
      <Col :span="8">
      <!--子菜单-->
      <Card style="height: 550px;margin: 0px 0px 0px 10px;" :bordered="false" :dis-hover="true">
        <template slot="title">子菜单权限列表</template>
        <Scroll :height="480">
          <Table :data="childArray" :columns="subMenuColumns">
            <template slot="loading">
              <h1 v-if="validate.api.list">数据正在加载中</h1>
              <h1 v-else>没有权限访问数据</h1>
            </template>
          </Table>
        </Scroll>
      </Card>
      </Col>
      <Col :span="8">
      <!--按钮-->
      <Card style="height: 550px;margin: 0px 0px 0px 10px;" :bordered="false" :dis-hover="true">
        <template slot="title">按钮权限列表</template>
        <Scroll :height="480">
          <Table :data="pointArray" :columns="subPointColumns">
            <template slot="loading">
              <h1 v-if="validate.api.list">数据正在加载中</h1>
              <h1 v-else>没有权限访问数据</h1>
            </template>
          </Table>
        </Scroll>
      </Card>
      </Col>
      <Col :span="8">
      <!--API-->
      <Card style="height: 550px;margin: 0px 0px 0px 10px;" :bordered="false" :dis-hover="true">
        <template slot="title">API权限列表</template>
        <Scroll :height="480">
          <Table :data="apiArray" :columns="subApiColumns">
            <template slot="loading">
              <h1 v-if="validate.api.list">数据正在加载中</h1>
              <h1 v-else>没有权限访问数据</h1>
            </template>
          </Table>
        </Scroll>
      </Card>
      </Col>
    </Row>

    <add-edit-permission ref="addEditPermission"></add-edit-permission>
  </div>
</template>

<script>

  import { getPermissionList,load } from '@/api/permission/permission';

  export default {
    name: 'permission',
    components:{
      AddEditPermission:()=>import("@/views/permission/child/add-edit-permission.vue")
    },
    data(){
      return {
        loading:true,
        permissionArray:[],
        childArray:[],
        pointArray:[],
        apiArray:[],
        params:{page:1,size:5,total:0,type:1,pid:0},
        styleValue:'none',
        validate:{
          point:{
            sub:this.$access.has_permission('POINT-PERMISSION-ALL'),
            update:this.$access.has_permission('POINT-PERMISSION-UPDATE'),
            add:this.$access.has_permission('POINT-PERMISSION-ADD')
          },
          api:{
            list:this.$access.has_api_permission("API-PERMISSION-LIST")
          }
        }
      }
    },
    computed:{
      permissionColumns(){
        let that = this;
        return [
          {type:'index',title:'序号',align:'center'},
          {key:'name',title:'权限名称',align:'center',render(h,params){
            return h('Tooltip',{props:{content:params.row.description,placement:'right'}},params.row.name);
          }},
          {key:'code',title:'权限编码',align:'center',tooltip:true},
          {title:'操作',align:'center',width:'500px',render(h,params){
              return h('span',[
                  h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'ios-eye'},style:{marginRight:'5px',display:that.validate.point.sub ? 'inlineBlock':'none' },on:{click(){
                        that.loadChildData(params.row);
                  }}},'查看子类数据'),
                  h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-cut'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none'},on:{click(){
                    that.openWindow('addEditPermission',params.row);
                      }}},'修改顶级菜单'),
                  h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-add'},style:{marginRight:'5px',display:that.validate.point.add ? 'inlineBlock':'none'},on:{click(){
                        that.setPid(1,params.row.id);
                        that.openWindow('addEditPermission',null);
                      }}},'添加子级菜单')
              ],'');
            },
            renderHeader(h,params){
            return h('Button',{props:{type:'error',size:'small',ghost:true,icon:'md-add'},style:{marginRight:'5px',display:that.validate.point.add ? 'inlineBlock':'none'},on:{click(){
                  that.setPid(1,0);
                  that.openWindow('addEditPermission',null);
            }}},'添加顶级菜单');
          }}
        ];
      },
      subMenuColumns(){
        let that = this;
        return [
          {key:'name',title:'权限名称',align:'center',render(h,params){
              return h('Tooltip',{props:{content:params.row.description,placement:'right'}},params.row.name);
          }},
          {key:'code',title:'权限编码',align:'center',tooltip:true},
          {title:'操作',align:'center',render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-cut'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none'},on:{click(){
                      that.openWindow('addEditPermission',params.row);
                    }}},''),
                h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-add'},style:{marginRight:'5px',display:that.validate.point.add ? 'inlineBlock':'none'},on:{click(){
                      that.setPid(2,params.row.id);
                      that.openWindow('addEditPermission',null);
                    }}},'')
              ],'');
          }}
        ];
      },
      subPointColumns(){
        let that = this;
        return [
          {key:'name',title:'权限名称',align:'center',render(h,params){
              return h('Tooltip',{props:{content:params.row.description,placement:'right'}},params.row.name);
            }},
          {key:'code',title:'权限编码',align:'center',tooltip:true},
          {title:'操作',align:'center',render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-cut'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none'},on:{click(){
                      that.openWindow('addEditPermission',params.row);
                    }}},''),
                h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-add'},style:{marginRight:'5px',display:that.validate.point.add ? 'inlineBlock':'none'},on:{click(){
                      that.setPid(3,params.row.id);
                      that.openWindow('addEditPermission',null);
                    }}},'')
              ],'');
            }}
        ];
      },
      subApiColumns(){
        let that = this;
        return [
          {key:'name',title:'权限名称',align:'center',render(h,params){
              return h('Tooltip',{props:{content:params.row.description,placement:'right'}},params.row.name);
            }},
          {key:'code',title:'权限编码',align:'center',tooltip:true},
          {title:'操作',align:'center',render(h,params){
              return h('span',[
                h('Button',{props:{type:'primary',ghost:true,size:'small',icon:'md-cut'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none'},on:{click(){
                      that.openWindow('addEditPermission',params.row);
                    }}},'')
              ],'');
            }}
        ];
      }
    },
    watch:{
      childArray(data){
        if(data.length > 0){
          this.pointArray = [];
          this.apiArray = [];
          data.forEach(subMenu=>{
            if(subMenu.children && subMenu.children.length > 0){
              subMenu.children.forEach(subPoint=>{
                this.pointArray.push(subPoint);
                if(subPoint.children.length > 0){
                  subPoint.children.forEach(subApi=>{
                    this.apiArray.push(subApi);
                  })
                }
              })
            }
          });

          this.styleValue = "block"
        }else{
          this.pointArray = [];
          this.apiArray = [];
          this.styleValue = 'none'
        }
      }
    },
    methods:{
      getPermissionList(data){
        getPermissionList(this.params).then(res=>{
          if(res && res.data && res.data.data){
            this.permissionArray = res.data.data.rows;
            this.params.total = res.data.data.total;
          }else{
            this.permissionArray = [];
          }
          this.loading = false;
        })
      },
      loadChildData(data){  //加载子集数据集合
        load(data).then(res=>{
          if(res.data.data.length == 0){
            this.$Message.error("没有任何数据");
            return false;
          }else{
            this.childArray = res.data.data;
          }

        })
      },
      openWindow(name,data){
        if(data == null){
          this.$refs[name].permissionData = {};
          this.$refs[name].permissionData.type = this.params.type;
          this.$refs[name].permissionData.pid = this.params.pid;
        }else{
          this.$refs[name].permissionData = data;
        }
        this.$refs[name].value = true;
      },
      setPid(type,pid){
        this.params.type = type;
        this.params.pid = pid;
      },
    },
    created(){
      this.styleValue = 'none'
      if(this.validate.api.list){
        this.getPermissionList(this.params);
      }
    }
  };
</script>

<style scoped>

</style>
