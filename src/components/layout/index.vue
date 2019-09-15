<template>
  <Layout>
    <Header style="background-color: black">
      <Row style="border: 2px">
        <Col :span="3">
        <h1 class="text-gradient">LOGO</h1>
        </Col>
        <Col :span="6">
        <h1 class="text-gradient" style="font-size: 30px">安吉星★青鸟教务</h1>
        </Col>
        <Col :span="12" style="text-align: center">
        <Menu theme="dark" class="color" mode="horizontal" @on-select="selectParent" style="background-color: black;color: #ff6600;">
          <MenuItem v-for="item in computed_parent_menu" :name="item.name" :key="item.name">
            {{item.meta.title}}
          </MenuItem>
        </Menu>
        </Col>
        <Col :span="3" >

        <Dropdown trigger="click" style="margin-left: 20px">

          <h3 class="text-gradient">张三</h3>
          <DropdownMenu slot="list">
            <DropdownItem name="info"><a href="javascript:void(0)" @click="handleClick">用户信息</a></DropdownItem>
            <DropdownItem name="out">退出</DropdownItem>
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
  </Layout>
</template>

<script>
  export default {
    data(){
      return{
        preMenus:[],
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
      handleClick(){
        alert('A');
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
        let parentMenu = [];
        this.menu.totalMenu.forEach(item=>{
          if(item.meta.isParent == true && item.meta.hideInMenu == false){
            parentMenu.push(item);
          }
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
        }
        return arr;
      }
    },
    created() {
      this.preMenus = this.$store.state.user.access.roles.menus;
      this.menu.totalMenu = this.$router.options.routes;
      this.$router.push('/');
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

  Button{
    margin-right: 5px;
  }
</style>




<!--
<template>
  <Layout>
    <Header style="background-color: black">
      <Row style="border: 2px">
        <Col :span="3">
        <h1 class="text-gradient">LOGO</h1>
        </Col>
        <Col :span="6">
        <h1 class="text-gradient" style="font-size: 30px">智多星☆教务管理</h1>
        </Col>
        <Col :span="12" style="text-align: center">
        <Menu theme="dark" class="color" mode="horizontal" @on-select="selectParent" style="background-color: black;color: #ff6600;">
          <MenuItem v-for="item in computed_parent_menu" :name="item.name" :key="item.name">
            {{item.meta.title}}
          </MenuItem>
        </Menu>
        </Col>
        <Col :span="3" >
        <Dropdown trigger="click" style="margin-left: 20px">
          <h3 class="text-gradient">张三</h3>
          <DropdownMenu slot="list">
            <DropdownItem name="info"><a href="javascript:void(0)" @click="handleClick">用户信息</a></DropdownItem>
            <DropdownItem name="out">退出</DropdownItem>
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
              <MenuItem  v-for="menu in item.children" :to="item.path + '/' + menu.path" :key="menu.name" :name="menu.name">{{menu.meta.title}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content style="height: 912px;">
          <router-view />
        </Content>
      </Layout>
    </Content>
  </Layout>
</template>

<script>
  export default {
    data(){
      return{
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
      handleClick(){
        alert("A")
      },
      selectParent(name){
        if(name === 'home') this.siderValue = true;
        else this.siderValue = false;

        let childMenu = [];
        this.$router.options.routes.forEach(item=>{
          if(item.meta.parentName && item.meta.parentName === name){
            childMenu.push(item);
          }
        });
        this.menu.childMenu = childMenu;
      }
    },
    computed:{
      computed_parent_menu(){
        let parentMenu = [];
        this.menu.totalMenu.forEach(item=>{
          if(item.meta.isParent == true && item.meta.hideInMenu == false){
            parentMenu.push(item);
          }
        });
        return parentMenu;
      },
      computed_child_menu(){
        let arr = [],childArr = [];
        if(this.menu.childMenu && this.menu.childMenu.length > 0){
          this.menu.childMenu.forEach(item=>{
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
        }
        return arr;
      }
    },
    created() {
      this.menu.totalMenu = this.$router.options.routes;
      this.$router.push('/');
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

  Button{
    margin-right: 5px;
  }
</style>

-->
