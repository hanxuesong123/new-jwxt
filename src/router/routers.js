import Main from '@/components/layout/index.vue'

export default [
  /************ 以上为水平导航  ***********/
  {
    path:"/login",
    name:'login',
    component:()=>import("@/components/login/login.vue"),
    meta:{
      title: "登录页",
      icon:'md-add',
      hideInMenu: true,
      isParent: false
    }
  },
  {
    path: "/",
    name: "home",
    component: Main,
    meta: {
      title: "首页",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/affairs",
    name: "affairs",
    component: Main,
    meta: {
      title: "综合管理",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/qnzg",
    name: "qnzg",
    component: Main,
    meta: {
      title: "学术部门",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/quality2",
    name: "quality2",
    component: Main,
    meta: {
      title: "就业部门",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/quality3",
    name: "quality3",
    component: Main,
    meta: {
      title: "教质部门",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/administration",
    name: "administration",
    component: Main,
    meta: {
      title: "行政部门",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/quality5",
    name: "quality5",
    component: Main,
    meta: {
      title: "市场部门",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  {
    path: "/student",
    name: "student",
    component: Main,
    meta: {
      title: "学生专栏",
      icon:'md-add',
      hideInMenu: false,
      isParent: true
    }
  },
  /************ 以上为垂直导航  ***********/
  {
    path:'/base',
    name:'base',
    component:Main,
    meta:{
      title:'系统权限',
      icon:'',
      hideInMenu:false,
      parentName:'affairs'
    },
    children:[
      {
        path:'permission',
        name:'permission',
        component:()=>import("@/views/permission/permission.vue"),
        meta:{
          title:'权限管理',
          icon:'',
          hideInMenu:false
        }
      },
      {
        path:'role',
        name:'role',
        component:()=>import("@/views/permission/role.vue"),
        meta:{
          title:'角色管理',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  },
  {
    path:'/system',
    name:'system',
    component:Main,
    meta:{
      title:'系统管理',
      icon:'',
      hideInMenu:false,
      parentName:"affairs"
    },
    children:[
      {
        path:'general',
        name:'general',
        component:()=>import("@/views/other/general/index.vue"),
        meta:{
          title:'字典管理',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  },
  {
    path:'/staff_management',
    name:'staff_management',
    component:Main,
    meta:{
      title:'员工管理',
      icon:'',
      hideInMenu:false,
      parentName:'administration'
    },
    children: [
      {
        path:'employee',
        name:'employee',
        component:()=>import("@/views/permission/user.vue"),
        meta:{
          title:'员工录入',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  }
]
