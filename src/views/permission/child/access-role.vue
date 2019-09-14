<template>
  <div>
    <Drawer v-model="value" width="1000px" :closable="false">

      <Card style="height: 50px;background-color: #42b983;color: white" :bordered="false" :dis-hover="true">当选中的角色</Card>

      <Card style="height: 100px" :bordered="false" :dis-hover="true">
        <Scroll :height="80" v-if="checkArray.length > 0">
            <RadioGroup  v-model="tempCheckRadio" size="small" @on-change="radioChange"  v-for="item in computed_showArray"  :key="item.id" type="button">
              <Radio :label="item.id">{{item.name}}</Radio>&nbsp;&nbsp;&nbsp;
            </RadioGroup>
        </Scroll>
      </Card>

      <Card style="height: 50px;background-color: #42b983;color: white" :bordered="false" :dis-hover="true">当前所选角色拥有的权限</Card>

      <Card style="height: 300px" :bordered="false" :dis-hover="true">
        <Row v-if="tempCheckRadio != ''">
          <Col :span="6">
            <Card style="width: 190px;" :dis-hover="true">
              <template slot="title">顶级菜单权限</template>
              <Scroll :height="150">
                <Tag color="primary" v-for="item in permissionMenuArray" :key="item.id">{{item.name}}</Tag>
              </Scroll>
            </Card>
          </Col>

          <Col :span="6">
            <Card style="width: 190px;" :dis-hover="true">
              <template slot="title">子级菜单权限</template>
              <Scroll :height="150">
                <Tag color="success" v-for="item in permissionSubMenuArray" :key="item.id">{{item.name}}</Tag>
              </Scroll>
            </Card>
          </Col>

          <Col :span="6">
            <Card style="width: 190px;" :dis-hover="true">
              <template slot="title">按钮权限</template>
              <Scroll :height="150">
                <Tag color="warning" v-for="item in permissionPointArray" :key="item.id">{{item.name}}</Tag>
              </Scroll>
            </Card>
          </Col>

          <Col :span="6">
            <Card style="width: 190px;" :dis-hover="true">
              <template slot="title">api权限</template>
              <Scroll :height="150">
                <Tag color="error" v-for="item in permissionApiArray" :key="item.id">{{item.name}}</Tag>
              </Scroll>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style="height: 50px;background-color: #42b983;color: white" :bordered="false" :dis-hover="true">角色列表</Card>

      <Card style="height: 350px" :bordered="false" :dis-hover="true">
        <template slot="title">
          <!--<Input v-model="queries.subName" placeholder="子级菜单名称" @input="queryData('2')" style="width: 220px;" >
          <Button @click="resetData('2')" slot="append" icon="ios-trash-outline"></Button>
          </Input>-->
        </template>
        <Scroll :height="350">
         <CheckboxGroup v-model="checkArray" @on-change="checkChange">
            <CellGroup  :key="item.id"  v-for="item in roleArray">
              <Cell style="background-color: lightpink;margin: 5px"  :name="item.id" >
                <Checkbox :label="item.id">{{item.name}}</Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </Scroll>
      </Card>

      <div class="demo-drawer-footer">
        <Button type="success" icon="md-add" @click="handleSubmit">分配</Button>
      </div>

    </Drawer>
  </div>
</template>

<script>

  import { findRoles,assessRole,getAssessRoles } from '@/api/permission/role';
  import { getPermissionsByRoleId } from '@/api/permission/permission';

  export default {
    name: 'access-role',
    data(){
      return {
        value:false,
        userObject:{},
        roleArray:[],
        tempCheckRadio:'',
        checkArray:[],
        permissionArray:[],
        permissionMenuArray:[],
        permissionSubMenuArray:[],
        permissionPointArray:[],
        permissionApiArray:[]
      };
    },
    methods:{
      checkChange(data){
        this.checkArray = data;
      },
      radioChange(id){
        getPermissionsByRoleId(id).then(res=>{
          this.permissionArray = res.data.data;
        });
      },
      handleSubmit(){
        if(this.checkArray.length == 0){
          this.$Message.error("角色集不能为空");
          return false;
        }
        assessRole({userId:this.userObject.id,roleIds:this.checkArray.join(",")}).then(res=>{
          if(res.data.code == 10000) this.$Message.success(res.data.message);
          else this.$Message.error(res.data.message);
          this.value = false;
          this.$parent.getTeacherList(this.$parent.params);
        })
      }
    },
    computed:{
      computed_showArray(){
        let arr = [];
        if(this.checkArray.length > 0){
          this.checkArray.forEach(roleId=>{
            this.roleArray.forEach(role=>{
              if(role.id == roleId){
                arr.push(role);
              }
            });
          });
        }
        return arr;
      }
    },
    watch:{
      value(value){
        if(value){
          findRoles().then(res=>this.roleArray = res.data.data); //加载所有角色
          getAssessRoles(this.userObject.id).then(res=>this.checkArray = res.data.data)//数据回显
        }
      },
      permissionArray(){
        this.permissionMenuArray = [];
        this.permissionSubMenuArray = [];
        this.permissionPointArray = [];
        this.permissionApiArray = [];
        this.permissionArray.forEach(permission=>{
          if(permission.type == '1' && permission.pid == '0') this.permissionMenuArray.push(permission);
          if(permission.type == '1' && permission.pid != '0') this.permissionSubMenuArray.push(permission);
          if(permission.type == '2') this.permissionPointArray.push(permission);
          if(permission.type == '3') this.permissionApiArray.push(permission);
        });
      }
    },
    created(){
      this.checkArray = [];
      this.tempCheckRadio = '';
      this.permissionMenuArray=[];
      this.permissionSubMenuArray=[];
      this.permissionPointArray=[];
      this.permissionApiArray=[];
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
