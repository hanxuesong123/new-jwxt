<template>
  <Layout>
    <Header style="background-color: black">
      <Row style="border: 2px">
        <Col :span="4">
          <img src="../../assets/image/logo-new1.png" width="100px" height="50px" style="margin-top: 10px" />
        </Col>
        <Col :span="7">
          <h1 class="text-gradient" style="font-size: 30px">河北省石家庄市智谷 &nbsp; ★ &nbsp; 青鸟教务</h1>
        </Col>
        <Col :span="12" style="text-align: center">
          <Menu theme="dark" class="color" mode="horizontal" @on-select="selectParent" style="background-color: black;color: #ff6600;">
            <MenuItem v-for="item in computed_parent_menu" :name="item.name" :key="item.name">
              {{item.meta.title}}
            </MenuItem>
          </Menu>
        </Col>
        <Col :span="1" >

          <Dropdown trigger="click" style="margin-left: 20px">

            <h3 class="text-gradient">{{nickName}}</h3>
            <DropdownMenu slot="list">
              <DropdownItem name="info"><a href="javascript:void(0)" @click="resetPassword('resetPassword')">修改密码</a></DropdownItem>
              <DropdownItem name="out"><a href="javascript:void(0)" @click="back">退出系统</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Header>

    <Content style="height: 800px;background-color: black">
      <Layout>
        <Sider v-model="siderValue" :collapsible="true" :collapsed-width="0" :hide-trigger="true"  :default-collapsed="true" :style="{height: '912px',backgroundColor: 'black'}">
          <Menu accordion theme="dark" width="auto" style="background-color: black">
            <Submenu v-for="(item,index) in computed_child_menu" :name="item.name" :key="item.name">
              <template slot="title">
                {{item.meta.title}}
              </template>
              <MenuItem  v-for="menu in item.children" :to="item.path + '/' + menu.path"
                         :key="menu.name" :name="menu.name">{{menu.meta.title}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content style="height: 912px;">
          <router-view />
        </Content>
      </Layout>
    </Content>
    <reset-password ref="resetPassword"></reset-password>
  </Layout>
</template>

<script>

  import {setToken} from "@/utils/tools";
  import { mapActions } from 'vuex';
  import { logout } from "@/api/other/login";

  export default {
    components:{
      ResetPassword:()=>import("@/components/login/reset-password.vue")
    },
    data(){
      return{
        preMenus:[],
        openNames:[],
        activeName :'',
        siderValue:false,
        color:'#19be6b',
        menu:{
          totalMenu:[],
          childMenu:[]
        },
        tab:{
          activeTab:null,
          mainTabs:[],
          show:true
        }
      };
    },
    methods:{
      ...mapActions([
        'logout'
      ]),
      resetPassword(name){
        this.$refs[name].user = {};
        this.$refs[name].value = true;
      },
      back(){
        this.$Modal.confirm({
          content:'确定要退出吗?',
          title:'友情提示',
          onOk:()=>{
            logout().then(res=>{
              setToken("");
              this.logout();
              this.$router.push({name:'login'});
              this.$Message.success("用户已退出");
            });
          }
        })
      },
      selectParent(name){
        if(name === 'home') this.siderValue = true;
        else this.siderValue = false;
        let childMenu = [];
        this.menu.totalMenu.forEach(item=>{
          if(item.meta.parentName && item.meta.parentName === name){
            childMenu.push(item);
          }
        });
        this.menu.childMenu = childMenu;
      }
    },
    computed:{
      computed_parent_menu(){

        let subMenus = this.menu.totalMenu.filter(item=>{ //查询所有的子级菜单
          return  item.children && item.children.length > 0;
        });

        //与当前用户的权限菜单进行对比,如果有则查询其顶级菜单,并把顶级菜单显示,没有则隐藏
        let okMenu = [];
        this.preMenus.forEach(user_menu_name=>{
          subMenus.forEach(item=>{
            if(user_menu_name == item.name){
              okMenu.push(item);
            }
          });
        });

        let set = new Set();

        okMenu.forEach(item=>{
          set.add(item.meta.parentName);
        });

        let parentMenus = this.menu.totalMenu.filter(item=>{
          return item.meta.isParent == true;
        });

        let parentMenu = [];
        parentMenus.forEach(parent=>{
          set.forEach(name =>{
            if(parent.name == name){
              parentMenu.push(parent);
            }
          })
        });

        return parentMenu;
      },
      computed_child_menu(){
        let arr = [],childArr = [];
        if(this.menu.childMenu && this.menu.childMenu.length > 0){
          this.menu.childMenu.forEach(item=>{
            if(this.preMenus.indexOf(item.name)<0){
              item.meta.hideInMenu = true;
              item.children.forEach(item1=>{
                if(this.preMenus.indexOf(item1.name)<0) {
                  item1.meta.hideInMenu = true;
                }
              })
            }else{
              item.children.forEach(item1=>{
                if(this.preMenus.indexOf(item1.name)<0) {
                  item1.meta.hideInMenu = true;
                }
              })
            }

            if(item.meta.hideInMenu == false){//剔除隐藏的父组件
              if(item.children && item.children.length > 0){
                childArr = [];
                for(let i = 0 ; i < item.children.length; i ++){
                  if(item.children[i] && item.children[i].meta && item.children[i].meta.hideInMenu == false) { //剔除隐藏的子组件
                    childArr.push(item.children[i]);
                  }
                }
                item.children = childArr;
                arr.push(item);
              }
            }

          });
        };
        return arr;
      }
    },
    created() {
      this.nickName = this.$store.state.user.access.nickName;
      this.preMenus = this.$store.state.user.access.roles.menus;
      this.menu.totalMenu = this.$router.options.routes;
      //this.$router.push('/');


      this.$nextTick(function(){
        let path = this.$route.path;
        console.log(path);
        let arr = path.split("/");
        if(arr[1] != null){
          this.menu.totalMenu.forEach(item=>{
            if(item.name == arr[1]){
              this.selectParent(item.meta.parentName)
            }
          });
        }
        this.openNames.push(arr[1]);
        this.activeName = arr[2];
      });
    }
  };
</script>

<style scoped>
  .text-gradient {
    display: inline-block;
    color: green;
    font-family: '微软雅黑';
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(0,0,0,0)), to(rgba(246,202,157,.7)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo{
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/image/logo-new.png");
    padding: 10px 10px 10px 10px;
    background-size: cover;
    background-position: center;
  }

  Button{
    margin-right: 5px;
  }
</style>
