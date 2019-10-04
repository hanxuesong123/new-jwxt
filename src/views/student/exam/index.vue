<template>
    <div>

        <Card>
            <Tooltip content="刷新">
                <Button style="margin-left: 10px" type="primary" shape="circle" icon="md-refresh" ghost size="small" @click="getList(params)"></Button>
            </Tooltip>
        </Card>

        <self-table :data="data" :columns="columns" :list="getList" :params="params" :loading="loading"></self-table>

        <analysis-exam ref="analysisExam"></analysis-exam>
        <show-exam ref="showExam" :parent="this"></show-exam>
        <show-student-exam ref="showStudentExam"></show-student-exam>
    </div>
</template>

<script>

    import { getList,getScoreStatus } from "@/api/student/exam";
    import { formatDate } from "@/utils/tools";

    export default {
        name: "student-exam-index",
        components:{
            AnalysisExam:()=>import("@/views/academic/child/analysis-exam.vue"),
            ShowExam:()=>import("@/views/student/exam/show-exam.vue"),
            ShowStudentExam:()=>import("@/views/student/exam/show-student-exam.vue")
        },
        data(){
            return {
                data:[],
                loading:true,
                params:{page:1,size:20,total:0,questionType:'1'}
            }
        },
        computed:{
          columns(){
              let that = this;
              return [
                  {type:'index',title:'序号',width:'80px',align:'center'},
                  {key:'examName',title:'笔试试卷名称',align:'center'},
                  {key:'examTime',title:'考试时间',align:'center',render(h,params){ return h('span',{},formatDate(params.row.examTime))}},
                  {key:'examType',title:'试卷类型',align:'center',render(h,params){
                          return h('Tag',{props:{color:params.row.examType == 1? 'warning' : (params.row.examType == 2? 'primary':'error')}},params.row.examType == 1? '日测' : (params.row.examType == 2? '周测':'月考'));
                      }},
                  {key:'examStatus',title:'试卷状态',align:'center',render(h,params){
                          return h('Tag',{props:{color:params.row.examStatus == '1' ? 'pink' : (params.row.examStatus == '2' ? 'error' : (params.row.examStatus == '3' ? 'warning' : 'blue'))}},
                              params.row.examStatus == '1' ? '未开始' : (params.row.examStatus == '2' ? '进行中' : (params.row.examStatus == '3' ? '批阅中' : '已结束')));
                      }},
                  {key:'opt',title:'操作',align:'center',render(h,params){
                    return h('span',[
                        h('Button',{props:{type:'primary',icon:'ios-bookmarks-outline',ghost:true,size:'small',disabled:params.row.examStatus != '2'},style:{marginRight:'5px'},on:{click(){
                            that.openExamWindow(params.row,'start','showExam')
                                }}},'开始考试'),
                        h('Button',{props:{type:'primary',icon:'ios-eye',ghost:true,size:'small',disabled:params.row.examStatus != '4'},style:{marginRight:'5px'},on:{click(){
                            that.openExamWindow(params.row,'show','showStudentExam')
                                }}},'查看试卷'),
                        h('Button',{props:{type:'primary',icon:'ios-photos',size:'small',disabled: params.row.examStatus == 4 ? false : true},style:{marginRight:'5px'},on:{click(){
                                    that.analysisExam('analysisExam',params.row);
                                }}},'成绩分析'),
                    ],'');
                  }}
              ];
          }
        },
        methods:{
            analysisExam(name,data){
                this.$refs[name].examObject = data;
                this.$refs[name].value = true;
            },
            getList(data){
                getList(data).then(res=>{
                    this.params.total = res.data.data.total;
                    this.data = res.data.data.rows;
                    this.loading = false;
                });
            },
            openExamWindow(data,type,name){
                switch (type) {
                    case 'start':
                        getScoreStatus(data.id).then(res=>{
                            if(res.data.code === 10000){
                                this.$refs[name].examData = data;
                                this.$refs[name].value = true;
                            }else if(res.data.code === 30101 && data.examStatus != 4){
                                this.$Message.error(res.data.message);
                                return false;
                            }
                        });

                        break;
                    case 'show':
                        this.$refs[name].examData = data;
                        this.$refs[name].student = true;
                        this.$refs[name].value = true;
                        break;
                }
            }
        },
        created() {
            this.getList(this.params);
        }
    }
</script>

<style scoped>

</style>