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
    path: "/academic",
    name: "academic",
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
    path: "/quality",
    name: "quality",
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

  //综合管理
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
    //学术部门
  {
    path:'/curriculum',
    name:'curriculum',
    component:Main,
    meta:{
      title:'课程设计',
      icon:'',
      hideInMenu:false,
      parentName:'academic'
    },
    children:[
      {
        path:'curriculum_scanner',
        name:'curriculum_scanner',
        component:()=>import('@/views/academic/curriculum/scanner.vue'),
        meta:{
          title:'课程录入',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  },
  {
    path:'/exam',
    name:'exam',
    component:Main,
    meta: {
      title: "考试中心",
      icon:'',
      hideInMenu: false,
      parentName: "academic"
    },
    children:[
      {
        path: "question",
        name: "question",
        component: () => import("@/views/academic/question/scanner.vue"),
        meta: {
          title: "试题录入",
          hideInMenu: false
        }
      },
      {
        path: "scanner_exam",
        name: "scanner_exam",
        component: () => import("@/views/academic/exam/scanner.vue"),
        meta: {
          title: "发布试卷",
          hideInMenu: false
        }
      }
    ]
  },
  {
    path:'/supervise',
    name:'supervise',
    component:Main,
    meta:{
      title:'监测管理',
      icon:'',
      hideInMenu: false,
      parentName: "academic"
    },
    children:[
      {
        path: "supervise_score",
        name: "supervise_score",
        component: () => import("@/views/academic/supervise/score_supervise.vue"),
        meta: {
          title: "成绩监测",
          hideInMenu: false
        }
      }
    ]
  },
    //行政部门
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
  },
    // 教质部门  当前用户this.$store.state.user.access.roles.menus只有 classes_management,classes_scanner
  {
    path:'/classes_management',
    name:'classes_management',
    component:Main,
    meta:{
      title:'班级管理',
      icon:'',
      hideInMenu:false,
      parentName:'quality'
    },
    children:[
      {
        path:'classes_scanner',
        name:'classes_scanner',
        component:()=>import("@/views/quality/classes/scanner.vue"),
        meta:{
          title:'班级录入',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  },
  {
    path:'/student_management',
    name:'student_management',
    component:Main,
    meta:{
      title:'学员管理',
      icon:'',
      hideInMenu:false,
      parentName:'quality'
    },
    children:[
      {
        path:'student_scanner',
        name:'student_scanner',
        component:()=>import("@/views/quality/student/index.vue"),
        meta:{
          title:'学员录入',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  },
    //学生专栏
  {
    path:'/stu_info',
    name:'stu_info',
    component:Main,
    meta:{
      title:'我的学习',
      icon:'',
      hideInMenu:false,
      parentName:'student'
    },
    children:[
      {
        path:'student_exam',
        name:'student_exam',
        component:()=>import("@/views/student/exam/index.vue"),
        meta:{
          title:'考试管理',
          icon:'',
          hideInMenu:false
        }
      }
    ]
  }
]
