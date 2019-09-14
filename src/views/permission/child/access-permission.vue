<template>
  <Drawer v-model="value"  width="1350px" :closable="false">

    <Card style="height: 50px;background-color: #42b983;color: white" :bordered="false" :dis-hover="true">当前选中角色拥有的权限</Card>

    <Card style="height: 200px" :bordered="false" :dis-hover="true">
      <Scroll :height="180">
        <span style="display: inline-block" v-for="item in computed_showArray" :key="item.id"><!--colors[Math.floor(Math.random()*4)]-->
          <Tag :color="(item.type == '1' && item.pid == '0') ? 'primary': (item.type == '1' && item.pid != '0') ? 'success': item.type == '2' ? 'warning' : 'error'">{{item.name}}</Tag>&nbsp;&nbsp;&nbsp;
        </span>
      </Scroll>
    </Card>

    <Card style="height: 50px;background-color: #42b983;color: white;margin: 10px" :bordered="false" :dis-hover="true">权限列表</Card>

    <Card  :bordered="false" :dis-hover="true">
      <Card style="width: 300px;height: 500px;display: inline-block;margin-right: 10px">
        <template slot="title">
          <Input v-model="queries.parentName" placeholder="顶级菜单名称" @input="queryData('1')" style="width: 220px;" >
          <Button @click="resetData('1')" slot="append" icon="ios-trash-outline"></Button>
          </Input>
        </template>
        <Scroll :height="400">
          <CheckboxGroup v-model="checkArray" @on-change="checkChange">
            <CellGroup  >
              <Cell  style="background-color: #D3D7D5;margin: 5px" :name="item.id" :key="item.id"  v-for="item in parentMenuArray">
                <Checkbox :label="item.id">{{item.name}}</Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </Scroll>
      </Card>

      <Card style="width: 300px;height: 500px;display: inline-block;margin-right: 10px">
        <template slot="title">
          <Input v-model="queries.subName" placeholder="子级菜单名称" @input="queryData('2')" style="width: 220px;" >
          <Button @click="resetData('2')" slot="append" icon="ios-trash-outline"></Button>
          </Input>
        </template>
        <Scroll :height="400">
          <CheckboxGroup v-model="checkArray" @on-change="checkChange">
            <CellGroup  :key="item.id"  v-for="item in subMenuArray">
              <Cell style="background-color: #B2B4B3;margin: 5px"  :name="item.id" >
                <Checkbox :label="item.id">{{item.name}}</Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </Scroll>
      </Card>

      <Card style="width: 300px;height: 500px;display: inline-block;margin-right: 10px">
        <template slot="title">
          <Input v-model="queries.pointName" placeholder="按钮权限名称" @input="queryData('3')" style="width: 220px;" >
          <Button @click="resetData('3')" slot="append" icon="ios-trash-outline"></Button>
          </Input>
        </template>
        <Scroll :height="400">
          <CheckboxGroup v-model="checkArray" @on-change="checkChange">
            <CellGroup>
              <Cell style="background-color: #888989;margin: 5px" :name="item.id"  :key="item.id"  v-for="item in pointArray">
                <Checkbox  :label="item.id">{{item.name}}</Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </Scroll>
      </Card>

      <Card style="width: 300px;height: 500px;display: inline-block;margin-right: 10px">
        <template slot="title">
          <Input v-model="queries.apiName" placeholder="API权限名称" @input="queryData('4')" style="width: 220px;" >
          <Button @click="resetData('4')" slot="append" icon="ios-trash-outline"></Button>
          </Input>
        </template>
        <Scroll :height="400">
          <CheckboxGroup v-model="checkArray" @on-change="checkChange">
            <CellGroup :name="item.id" :key="item.id"  v-for="item in apiArray">
              <Cell style="background-color: #636564;color:white;margin: 5px">
                <Checkbox  :label="item.id">{{item.name}}</Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </Scroll>
      </Card>
    </Card>
    <div class="demo-drawer-footer">
      <Button type="primary" icon="md-add" @click="handleSubmit">分配</Button>
    </div>


  </Drawer>
</template>

<script>

  import { getPermissions } from '@/api/permission/permission';
  import { accessPermission,getAssessPermissions } from '@/api/permission/role';
  import { handleArrayDataUtil,handleParentDataUtil,handleQueryDataUtil } from '@/utils/tools';


  export default {
    name: 'access-permission',
    data(){
      return {
        queries:{
          parentName:'',
          subName:'',
          pointName:'',
          apiName:''
        },
        colors:['red','blue','green','pink'],
        value : false,
        roleObject: {},
        checkArray:[],
        tempCheckArray:[],
        permissionArray:[],
        parentMenuArray:[],
        subMenuArray:[],
        pointArray:[],
        apiArray:[]
      };
    },
    watch:{
      value(value){
        if(value){
          this.parentMenuArray = [];
          this.subMenuArray = [];
          this.pointArray = [];
          this.apiArray = [];
          getPermissions().then(res=>{
            this.permissionArray = res.data.data;
            handleParentDataUtil(this.permissionArray,this.parentMenuArray);
            handleArrayDataUtil(this.parentMenuArray,this.subMenuArray,this.permissionArray);
            handleArrayDataUtil(this.subMenuArray,this.pointArray,this.permissionArray);
            handleArrayDataUtil(this.pointArray,this.apiArray,this.permissionArray);
          });

          getAssessPermissions(this.roleObject.id).then(res=>{
            this.checkArray = res.data.data;
          })
        }
      }
    },
    computed:{
      computed_showArray(){//展示已选中的权限数据
        let arr = [];
        if(this.checkArray.length > 0 && this.permissionArray.length > 0){
          this.permissionArray.forEach(item=>{
            if(this.checkArray.join(",").includes(item.id)){
              arr.push(item);
            }
          })
        }
        return arr;
      }
    },
    methods:{

      checkChange(data){
        this.checkArray = data;
      },
      handleSubmit(){

        if(this.checkArray.length == 0){
          this.$Message.error("没有任何关联项");
          return false;
        }

        accessPermission({roleId:this.roleObject.id,permissionIds:this.checkArray.join(',')}).then(res=>{
          if(res.data.code == 10000) this.$Message.success(res.data.message);
          else this.$Message.error(res.data.message);
          this.value = false;
          this.$parent.getRoleList(this.$parent.params);
        });
      },
      queryData(type){
        if(type == '1'){
          if(this.queries.parentName.trim() != ''){
            this.parentMenuArray = handleQueryDataUtil(this.queries.parentName,this.parentMenuArray);
          }else{
            this.parentMenuArray = [];
            handleParentDataUtil(this.permissionArray,this.parentMenuArray);
          }
        }else if(type == '2'){
          if(this.queries.subName.trim() != ''){
            this.subMenuArray = handleQueryDataUtil(this.queries.subName,this.subMenuArray);
          }else{
            this.subMenuArray = [];
            handleArrayDataUtil(this.parentMenuArray,this.subMenuArray,this.permissionArray);
          }
        }else if(type == '3'){
          if(this.queries.pointName.trim() != ''){
            this.pointArray = handleQueryDataUtil(this.queries.pointName,this.pointArray);
          }else{
            this.pointArray = [];
            handleArrayDataUtil(this.subMenuArray,this.pointArray,this.permissionArray);
          }
        }else if(type == '4'){
          if(this.queries.apiName.trim() != ''){
            this.apiArray = handleQueryDataUtil(this.queries.apiName,this.apiArray);
          }else{
            this.apiArray = [];
            handleArrayDataUtil(this.pointArray,this.apiArray,this.permissionArray);
          }
        }
      },
      resetData(type){
        switch (type) {
          case '1':
            this.queries.parentName = '';
            this.parentMenuArray = [];
            handleParentDataUtil(this.permissionArray,this.parentMenuArray);
            break;
          case '2':
            this.queries.subName = '';
            this.subMenuArray = [];
            handleArrayDataUtil(this.parentMenuArray,this.subMenuArray,this.permissionArray);
            break;
          case '3':
            this.queries.pointName = '';
            this.pointArray = [];
            handleArrayDataUtil(this.subMenuArray,this.pointArray,this.permissionArray);
            break;
          case '4':
            this.queries.apiName = '';
            this.apiArray = [];
            handleArrayDataUtil(this.pointArray,this.apiArray,this.permissionArray);
            break;
        }
      }
    },
    created(){
      this.checkArray = [];
    }
  };
</script>

<style scoped>
  .demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
