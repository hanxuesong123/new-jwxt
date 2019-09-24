<template>
    <div>

        <Card :bordered="false" :dis-hover="true">
            <template slot="title">
                <Button type="primary"  icon="ios-search" :style="{display:validate.point.query ? 'inlineBlock':'none',width: '100px',marginRight: '5px'}" @click="openQueryWindow">查询数据</Button>
                <Button type="primary"  icon="ios-search" :style="{display:validate.point.query ? 'inlineBlock':'none',width: '100px',marginRight: '5px'}" @click="params={page:1,size:20},getStudentList(params)">重置查询</Button>
                <Button type="primary"  icon="md-add" :style="{display:validate.point.add ? 'inlineBlock':'none',width: '100px'}"  @click="openWindow('addEditStudent',null)">新增学生</Button>
            </template>
        </Card>


        <self-table :list="getStudentList" :validate="validate.api.list" :data="studentArray" :columns="columns" :loading="loading" :params="params"></self-table>


        <Drawer v-model="value" title="查询" :closable="true" :width="500">
            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员姓名" v-model="params.nickName" />
            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员电话" v-model="params.telephone" />
            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员身份证号" v-model="params.idCard" />

            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员email" v-model="params.email"/>
            <Select style="margin-bottom: 10px" clearable v-model="params.sex" placeholder="请选择学员性别">
                <Option value="1">男</Option>
                <Option value="2">女</Option>
            </Select>
            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员户籍地址" v-model="params.residenceAddress" />
            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学员现居地址" v-model="params.nowAddress" />
            <Select style="margin-bottom: 10px"  placeholder="请选择学员专业" clearable  v-model="params.education" >
                <Option :value="'1'">初中</Option>
                <Option :value="'2'">高中</Option>
                <Option :value="'3'">中专</Option>
                <Option :value="'4'">大专</Option>
                <Option :value="'5'">本科</Option>
            </Select>

            <Input type="text" style="margin-bottom: 10px" placeholder="请输入毕业院校" v-model="params.graduationSchool" />

            <Select style="margin-bottom: 10px" v-model="params.major"  clearable placeholder="请选择学员专业">
                <Option :value="'1'">计算机专业</Option>
                <Option :value="'2'">其他专业</Option>
            </Select>

            <Input style="margin-bottom: 10px" type="text" placeholder="请输入学生的紧急联系人" v-model="params.emergencyContact" />

            <Select style="margin-bottom: 10px" v-model="params.status"  clearable placeholder="请选择启禁状态">
                <Option :value="'1'">启用</Option>
                <Option :value="'2'">禁用</Option>
            </Select>

            <Select style="margin-bottom: 10px" v-model="params.studyType"  clearable placeholder="请选择学员在读状态">
                <Option :value="'1'">在读</Option>
                <Option :value="'2'">退学</Option>
                <Option :value="'3'">休学</Option>
            </Select>



            <div class="demo-drawer-footer">
                <Button type="primary" @click="getStudentList(params),value = false" icon="md-add" style="margin-right: 5px">提交</Button>
            </div>

        </Drawer>



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
                value : false,
                params:{page:1,size:20,total:0},
                studentArray:[],
                validate:{
                    api:{
                        list:this.$access.has_api_permission('API-TEACHER-STUDENT-LIST')
                    },
                    point:{
                        query:this.$access.has_permission('POINT-TEACHER-STUDENT-LIST'),
                        add:this.$access.has_permission('POINT-TEACHER-STUDENT-ADD'),
                        update:this.$access.has_permission('POINT-TEACHER-STUDENT-UPDATE'),
                        access:this.$access.has_permission('POINT-TEACHER-STUDENT-ACCESS-CLASSES')
                    }
                }
            }
        },
        methods:{
            openQueryWindow(){
              this.params = {page:1,size:10};
              this.value = true;
            },
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
                    {width:'400px',title:'操作',align:'center',render(h,params){
                        return h('span',[
                            h('Button',{props:{type:'primary',icon:'md-cut',ghost:true,size:'small'},style:{marginRight:'5px',display:that.validate.point.update ? 'inlineBlock':'none' },on:{click(){
                                        that.openWindow('addEditStudent',params.row);
                                    }}},"修改学生"),
                            h('Button',{props:{type:'primary',icon:'md-grid',ghost:true,size:'small'},style:{marginRight:'5px',display:that.validate.point.access ? 'inlineBlock':'none' },on:{click(){
                                        that.accessClasses('accessClasses',params.row);
                                    }}},"指定班级"),
                        ],'');
                    }}
                ];
            }
        },
        created(){
            if(this.validate.api.list){
                this.getStudentList(this.params);
            }
        }
    }
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