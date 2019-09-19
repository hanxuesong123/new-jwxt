<template>
    <div>
        <self-table :list="getStudentList" :data="studentArray" :columns="columns" :loading="loading" :params="params"></self-table>
        <add-edit-student ref="addEditStudent"></add-edit-student>
        <access-classes ref="accessClasses"></access-classes>
    </div>
</template>

<script>

    import { list } from "@/api/quality/student";

    export default {
        name: "index",
        components:{
            AddEditStudent:()=>import("@/views/quality/child/add-edit-student.vue"),
            AccessClasses:()=>import("@/views/quality/child/access-classes.vue")
        },
        data(){
            return{
                loading:true,
                params:{page:1,size:20,total:0},
                studentArray:[]
            }
        },
        methods:{
            getStudentList(data){
                list(data).then(res=>{
                    this.studentArray = res.data.data.rows;
                    this.params.total = res.data.data.total;
                    this.loading = false;
                })
            },
            openWindow(name,data){
                if(data == null) this.$refs[name].studentObject = {};
                else this.$refs[name].studentObject = data;
                this.$refs[name].value = true;
            },
            accessClasses(name,data){
                this.$refs[name].data = {};
                this.$refs[name].studentObject = data;
                this.$refs[name].value = true;
            }
        },
        computed:{
            columns(){
                let that = this;
                return [
                    {type:'index',title:'序号',align:"center"},
                    {key:'nickName',title:'姓名',align:'center',render(h,params){
                        return h('a',{props:{href:'javascript:void(0)'},on:{click(){
                            alert("A");
                        }}},params.row.nickName);
                    }},
                    {key:'username',title:"用户名",align:'center'},
                    {key:'password',title:"密码",align:'center',tooltip:true,render(h,params){
                        return h('a',{props:{href:'javascript:void(0)'},on:{click(){
                            alert("点击之后显示加密前的密码");
                        }}},params.row.password);
                    }},
                    {key:'telephone',title:"电话",align:'center'},
                    {key:'email',title:"邮箱",align:'center'},
                    {key:'sex',title:"性别",align:'center',render(h,params){
                        return h('span',{},params.row.sex == '1' ? '男' : '女');
                    }},
                    {key:'residenceAddress',title:"户籍",align:'center',tooltip:true},
                    {key:'classesName',title:"所在班级",align:'center'},
                    {key:'status',title:"启禁状态",align:'center',render(h,params){
                        return h('span',{},params.row.status =='1'? '启用' : '禁用');
                        }},
                    {key:'studyType',title:"学习状态",align:'center',render(h,params){
                        return h('span',{},params.row.studyType == '1' ? '在学' : (params.row.studyType == '2' ? '退学' : '休学'));
                    }},
                    {width:'400px',align:'center',renderHeader(h,params){
                        return h('Button',{props:{type:'error',icon:'md-add',ghost:true,size:'small'},on:{click(){
                            that.openWindow('addEditStudent',null);
                        }}},"添加学员");
                        },render(h,params){
                        return h('span',[
                            h('Button',{props:{type:'primary',icon:'md-cut',ghost:true,size:'small'},style:{marginRight:'5px'},on:{click(){
                                        that.openWindow('addEditStudent',params.row);
                                    }}},"修改"),
                            h('Button',{props:{type:'primary',icon:'md-grid',ghost:true,size:'small'},on:{click(){
                                        that.accessClasses('accessClasses',params.row);
                                    }}},"指定班级"),
                        ],'');
                    }}
                ];
            }
        },
        created(){
            this.getStudentList(this.params);
        }
    }
</script>

<style scoped>

</style>