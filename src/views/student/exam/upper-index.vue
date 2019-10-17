<template>
    <div>

        <Card>
            <Tooltip content="刷新">
                <Button style="margin-left: 10px" type="primary" shape="circle" icon="md-refresh" ghost size="small" @click="getList(params)"></Button>
            </Tooltip>
        </Card>

        <self-table :data="data" :columns="columns" :list="getList" :params="params" :loading="loading"></self-table>


        <!-- 查看上机题内容 -->
        <Drawer v-model="upper_window.value" :width="800" :closable="false">

            <template slot="header">
                <Button type="error" @click="handleSubmit">交卷</Button>
            </template>

            <Card style="background-color: #2c3e50;color: white;height:250px;margin: 20px 0px 20px 0px">
                <p>
                    上传视频要求:<br>
                    1.视频内容中,需有操作人姓名<br>
                    2.视频格式为: mp4<br>
                    3.视频时长: 3分钟以内<br>
                    4.多个上机题也只能上传一个视频<br>
                    <span style="color: red">5.上传视频成功后,即视为交卷,请谨慎操作</span><br>

                    <Upload ref="upload"
                            name="file"
                            :max-size="1024 * 1024 * 100"
                            :format="['mp4']"
                            :action="upper_window.url"
                            :headers="{'token':upper_window.token}"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :on-format-error="formatError"
                            :on-exceeded-size="exceededSize">
                        <Button ref="btn" type="success">上传视频</Button>
                    </Upload>
                </p>
            </Card>

            <Card style="background-color: #2c3e50;color: white;height: 500px" v-for="upper in upperList" :key="upper.id">
                <Scroll :height="450">
                    <p>
                        <Button type="warning"  :disabled="upper.upperUrl == '' || upper.upperUrl == null"  @click="downLoadUpper(upper.upperUrl)" style="margin-bottom: 20px">下载素材</Button>
                    </p>
                    <p>
                        {{upper.upperContent}}
                    </p>
                </Scroll>
            </Card>
        </Drawer>
        <analysis-exam ref="analysisExam"></analysis-exam>
        <show-student-exam ref="showStudentExam"></show-student-exam>
    </div>
</template>

<script>

    import { getList,getScoreStatus,getUpper } from "@/api/student/exam";
    import { formatDate,getToken } from "@/utils/tools";

    export default {
        name: "upper-index",
        components:{
            AnalysisExam:()=>import("@/views/academic/child/analysis-exam.vue"),
            ShowStudentExam:()=>import("@/views/student/exam/show-student-exam.vue")
        },
        data(){
            return {
                data:[],
                loading:true,
                params:{page:1,size:20,total:0,questionType:'2'},
                upperList:[],
                upper_window:{
                    value:false,
                    file:'',
                    token:getToken(),
                    url:""
                    //url:`http://localhost:56700/student/exam/upload/${examData.id}/${upperIds}`
                }
            }
        },
        computed:{
            columns(){
                let that = this;
                return [
                    {type:'index',title:'序号',width:'80px',align:'center'},
                    {key:'examName',title:'上机试卷名称',align:'center'},
                    {key:'examTime',title:'考试时间',align:'center',render(h,params){ return h('span',{},formatDate(params.row.examTime))}},
                    {key:'examType',title:'试卷类型',align:'center',render(h,params){
                            return h('Tag',{props:{color:params.row.examType == 1? 'warning' : (params.row.examType == 2? 'primary':'error')}},params.row.examType == 1? '日测' : (params.row.examType == 2? '周测':'月考'));
                        }},
                    {key:'examStatus',title:'试卷状态',align:'center',render(h,params){
                            return h('Tag',{props:{color:params.row.examStatus == '1' ? 'pink' : (params.row.examStatus == '2' ? 'error' : (params.row.examStatus == '3' ? 'warning' : 'blue'))}},
                                params.row.examStatus == '1' ? '未开始' : (params.row.examStatus == '2' ? '进行中' : (params.row.examStatus == '3' ? '批阅中' : '已结束')));
                        }},
                    {key:'opt',width:'400px',title:'操作',align:'center',render(h,params){
                            return h('span',[
                                h('Button',{props:{type:'primary',icon:'ios-eye',ghost:true,size:'small',disabled:params.row.examStatus != '2'},style:{marginRight:'5px'},on:{click(){
                                    that.showExamContent(params.row);
                                }}},'开始考试'),
                                h('Button',{props:{type:'primary',icon:'ios-eye',ghost:true,size:'small',disabled:params.row.examStatus != '4'},style:{marginRight:'5px'},on:{click(){
                                    that.openExamWindow(params.row,'showStudentExam')
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
            openExamWindow(data,name){
                this.$refs[name].examData = data;
                this.$refs[name].student = true;
                this.$refs[name].value = true;
            },
            analysisExam(name,data){
                this.$refs[name].examObject = data;
                this.$refs[name].value = true;
            },
            getList(data){ //获得上机题列表
                getList(data).then(res=>{
                    this.params.total = res.data.data.total;
                    this.data = res.data.data.rows;
                    this.loading = false;
                });
            },
            showExamContent(data){ //查看内容的方法

                getScoreStatus(data.id).then(res=>{
                    if(res.data.code === 10000){
                        getUpper(data).then(res=>{
                            this.upperList = res.data.data;
                            let arr = [];
                            res.data.data.forEach(upper=>{
                               arr.push(upper.id)
                            });

                            this.upper_window.url = `http://192.168.18.210:80/student/exam/upload/${data.id}/${arr.join(",")}`;
                            this.upper_window.value = true;
                        });
                    }else if(res.data.code === 30101 && data.examStatus != 4){
                        this.$Message.error(res.data.message);
                        return false;
                    }
                });
            },
            downLoadUpper(data){ //下载素材的方法
              window.location.href =  data;
            },
            beforeUpload(file){
                this.upper_window.file = file;
                return false;
            },
            formatError(){
                this.$Message.error("只能上传MP4格式的文件");
            },
            exceededSize(){
                this.$Message.error("只能上传小于100MB的文件");
            },
            uploadError(){
                this.$Message.error("上传失败");
                return false;
            },
            uploadSuccess(response,file,fileList){
                if(response.code == 10000){
                    this.$Message.success(response.message);
                    this.upper_window.value = false;
                }else{
                    this.$Message.error(response.message);
                }
                this.getList(this.params);
            },
            handleSubmit(){
                console.log(this.upper_window.file);
                if(!this.upper_window.file){
                    this.$Message.error("请选择视频");
                    return false;
                }

                this.$refs['upload'].post(this.upper_window.file);
            }
        },
        created(){
            this.getList(this.params);
        }
    }
</script>

<style scoped>

</style>