<template>
    <div>
        <Card :bordered="false" :dis-hover="true" style="height: 50px;">
          <span v-if="validate.point.query">
             <RadioGroup type="button" v-model="params.questionType" style="margin-right: 5px;float: left">
              <Radio label="1">单/多/问试卷</Radio>
              <Radio label="2">上机试卷</Radio>
            </RadioGroup>

            <Select clearable v-model="params.classesId" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择班级">
              <Option :value="item.id" :key="item.id" v-for="item in classesArray">{{item.className}}</Option>
            </Select>

            <Input v-model="params.examName" style="width: 150px;margin-right: 5px;float: left" placeholder="请输入试卷名称" />

            <Select clearable v-model="params.examType" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择试卷类型">
              <Option :value="1">日测</Option>
              <Option :value="2">周测</Option>
              <Option :value="3">月考</Option>
            </Select>

            <Select clearable v-model="params.examStatus" style="width: 150px;margin-right: 5px;float: left" placeholder="请选择试卷状态">
              <Option :value="1">未开始</Option>
              <Option :value="2">进行中</Option>
              <Option :value="3">批阅中</Option>
              <Option :value="4">已结束</Option>
            </Select>

            <Button type="info" @click="getExamList(params)" style="width: 150px;margin-right: 5px;float: left">查询数据</Button>
            <Button type="info" @click="params = {page:1,size:20,questionType:'1'},getExamList(params)" style="width: 150px;margin-right: 5px;float: left">重置查询</Button>
          </span>
          <Button type="primary" @click="openWindow('addEditExam',null)" :style="{width: '150px',marginRight: '5px',display:validate.point.add ? 'inlineBlock' : 'none'}">新增试卷</Button>
        </Card>

        <Card :bordered="false" :dis-hover="true">
            <self-table :list="getExamList" :data="examArray" :columns="columns" :loading="loading" :params="params"></self-table>
        </Card>

        <add-edit-exam ref="addEditExam"></add-edit-exam>
        <show-exam ref="showExam" :parent="this"></show-exam>
        <read-exam ref="readExam" :parent="this"></read-exam>
        <read-upper-exam ref="readUpperExam"></read-upper-exam>
        <analysis-exam ref="analysisExam"></analysis-exam>
        <show-object-exam ref="showObjectExam"></show-object-exam>
    </div>
</template>

<script>

    import { formatDate } from '@/utils/tools';
    import { list,startExam } from '@/api/academic/exam';
    import { findClasses } from '@/api/quality/classes';

    export default {
        name: 'exam-scanner',
        components:{
            AddEditExam:()=>import("@/views/academic/child/add-edit-exam.vue"),
            ShowExam:()=>import("@/views/academic/child/show-exam.vue"),
            ReadExam:()=>import("@/views/academic/child/read-exam.vue"),
            ReadUpperExam:()=>import("@/views/academic/child/read-upper-exam.vue"),
            AnalysisExam:()=>import("@/views/academic/child/analysis-exam.vue"),
            ShowObjectExam:()=>import("@/components/exam/show-object-exam.vue")
        },
        data(){
            return {
                loading:true,
                params:{page:1,size:20,total:0,questionType:'1'},
                examArray:[],
                classesArray:[],
                rowData:{},
                hiddenInfo:'none',
                validate:{
                    api:{
                        list:this.$access.has_api_permission('API-EXAM-LIST')
                    },
                    point:{
                        add:this.$access.has_permission('POINT-EXAM-RELEASE'), //新增
                        query:this.$access.has_permission('POINT-EXAM-LIST'), //列表
                        start:this.$access.has_permission('POINT-EXAM-START'),//开始考试
                        show:this.$access.has_permission('POINT-EXAM-SHOW'), //已交/未交
                        read:this.$access.has_permission('POINT-EXAM-READ'), //批阅试卷
                        analysis:this.$access.has_permission('POINT-EXAM-ANALYSIS'),//成绩分析
                        explain:this.$access.has_permission("POINT-EXAM-EXPLAIN"), //试卷讲解
                        stop:this.$access.has_permission('POINT-EXAM-STOP'), //停止考试
                        end:this.$access.has_permission("POINT-EXAM-END")//结束考试
                    }
                }
            };
        },
        methods:{
            openWindow(name,data){
                this.$refs[name].examObject = {};
                this.$refs[name].value = true;
            },
            getExamList(data){
                list(this.params).then(res=>{
                    this.examArray = res.data.data.rows;
                    this.params.total = res.data.data.total;
                    this.loading = false;
                });
            },
            startExam(data){
                this.$Modal.confirm({
                    title:'友情提示',
                    content:`确定要开启【${data.examName}】考试吗`,
                    onOk:()=>{
                        startExam(data).then(res=>{
                            if(res.data.code == 10000){
                                this.$Message.success(res.data.message);
                            }else{
                                this.$Message.error(res.data.message);
                            }
                            this.getExamList(this.params);
                        })
                    }
                })
            },
            showExam(name,data){
                this.$refs[name].examData = data;
                this.$refs[name].value = true;
            },
            readExam(name,data){
                this.$refs[name].examData = data;
                this.$refs[name].value = true;
                this.$refs[name].value1 = true;
            },
            readUpperExam(name,data){
              this.$refs[name].examData = data;
              this.$refs[name].value = true;
            },
            analysisExam(name,data){
                this.$refs[name].examObject = data;
                this.$refs[name].value = true;
            },
            showObjectExam(name,data){
                this.$refs[name].examData = data;
                this.$refs[name].value = true;
            }
        },
        computed:{
            columns(){
                let that = this;
                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'className',title:'班级名称',align:'center'},
                    {key:'examTime',title:'考试时间',align:'center',render(h,params){
                            return h('span',{},formatDate(params.row.examTime));
                        }},
                    {key:'examTimeLength',title:'考试时长',align:'center'},
                    {key:'examName',title:'试卷名称',align:'center',render(h,params){
                            //用于点击名称后,显示详情
                            return h('a',{on:{click() {
                                        that.rowData = params.row;
                                        that.hiddenInfo = 'block';
                                    }}},params.row.examName);}
                    },
                    {key:'examType',title:'试卷类型',align:'center',render(h,params){
                            return h('Tag',{props:{color:params.row.examType == 1? 'warning' : (params.row.examType == 2? 'primary':'error')}},params.row.examType == 1? '日测' : (params.row.examType == 2? '周测':'月考'));
                        }},
                    {key:'examStatus',title:'试卷状态',align:'center',render(h,params){
                            return h('Tag',{props:{color:params.row.examStatus == '1' ? 'pink' : (params.row.examStatus == '2' ? 'error' : (params.row.examStatus == '3' ? 'warning' : 'primary'))}},
                                params.row.examStatus == '1' ? '未开始' : (params.row.examStatus == '2' ? '进行中' : (params.row.examStatus == '3' ? '批阅中' : '已结束')));
                        }},
                    {key:'opt',title:'操作',align:'center',width:'600px',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',icon:'md-bulb',size:'small',disabled: params.row.examStatus == 1 ? false : true },style:{marginRight:'5px',display:that.validate.point.start ? 'inlineBlock':'none' },on:{click(){
                                            that.startExam(params.row);
                                        }}},'开始考试'),
                                h('Button',{props:{type:'primary',icon:'ios-eye',size:'small',disabled: params.row.examStatus == 2 ? false : true},style:{marginRight:'5px',display:that.validate.point.show ? 'inlineBlock':'none' },on:{click(){
                                            that.showExam('showExam',params.row);
                                        }}},'已交/未交'),
                                h('Button',{props:{type:'primary',icon:'ios-brush',size:'small',disabled: params.row.examStatus == 3  && !params.row.questionTypeIds.includes("4") ? false : true},style:{marginRight:'5px',display:that.validate.point.read ? 'inlineBlock':'none' },on:{click(){
                                            that.readExam('readExam',params.row);
                                        }}},'批阅试卷'),
                              h('Button',{props:{type:'primary',icon:'ios-brush',size:'small',disabled: params.row.examStatus == 3  && params.row.questionTypeIds.includes("4") ? false : true},style:{marginRight:'5px',display:that.validate.point.read ? 'inlineBlock':'none' },on:{click(){
                                    that.readUpperExam('readUpperExam',params.row);
                                  }}},'批阅上机'),
                                h('Button',{props:{type:'primary',icon:'ios-photos',size:'small',disabled: params.row.examStatus == 4 ? false : true},style:{marginRight:'5px',display:that.validate.point.analysis ? 'inlineBlock':'none' },on:{click(){
                                            that.analysisExam('analysisExam',params.row);
                                        }}},'成绩分析'),
                                h('Button',{props:{type:'primary',icon:'ios-create-outline',size:'small',disabled: params.row.examStatus == 4 ? false : true},style:{marginRight:'5px',display:that.validate.point.explain ? 'inlineBlock':'none' },on:{click(){
                                            that.showObjectExam('showObjectExam',params.row);
                                        }}},'试卷讲解'),
                            ],'');
                        }}
                ];
            }
        },
        created(){
            if(this.validate.api.list){
                findClasses().then(res=>this.classesArray = res.data.data);
                this.getExamList(this.params);
            }
        }
    };
</script>

<style scoped>

</style>
