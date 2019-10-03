<template>
    <div>
        <Drawer v-model="value" :width="800" :closable="false">
            <template slot="header">
                <Button type="error" @click="handleEndExam(examData)">结束考试</Button>
            </template>
            <Card :bordered="false" :dis-hover="true">
                <Table :data="computed_table_data" :columns="columns" :border="true"></Table>
            </Card>
        </Drawer>

        <Drawer v-model="value" :closable="false" :width="800" placement="left" :mask="false">
            <Card  style="background-color: #2c3e50;margin: 10px 0px 10px 0px;color: white;height: 400px" :bordered="false" :dis-hover="true" v-for="(upper,index) in upperList" :key="upper.id">
                <template slot="title"> 第{{index + 1}}题</template>
                <Scroll :height="300">
                    {{upper.upperContent}}
                </Scroll>
            </Card>
        </Drawer>

        <player-video ref="playerVideo"></player-video>

    </div>
</template>

<script>

    import { readStudentUppers,endExam } from "@/api/academic/exam";

    export default {
        name: "read-upper-exam",
        components:{
            PlayerVideo:()=>import("@/views/academic/child/player-video.vue")
        },
        data(){
            return {
                value : false,
                examData:{},
                upperList:[],
                studentExamContent :[]
            }
        },
        watch:{
            value(data){
                if(data){
                    this.getData();
                }
            }
        },
        computed:{
            columns(){
                let that = this;
                return [
                    {type:'index',title:'序号',align:'center'},
                    {type:'nickName',title:'学生姓名',align:'center',render(h,params){
                        return h('span',{},params.row.user.nickName);
                    }},
                    {type:'opt',title:'视频',align:'center',render(h,params){
                        return h('Button',{props:{type:'error',size:'small',ghost:true,icon:'ios-videocam',disabled:params.row.list[0] == null || params.row.score.upperScore > 0},on:{click(){
                            that.openPlayerWindow(params.row,'playerVideo');
                        }}},'观看');
                    }},
                    {type:'upperScore',title:'上机题评分',align:'center',render(h,params){
                        return h('span',{},params.row.score.upperScore);
                    }}
                ];
            },
            computed_table_data(){
                return this.studentExamContent;
            }
        },
        methods:{
            openPlayerWindow(data,name){
                this.$refs[name].data = data;
                this.$refs[name].value = true;
            },
            getData(){
                readStudentUppers(this.examData).then(res=>{
                    this.upperList = res.data.data.uppers;
                    this.studentExamContent = res.data.data.list;
                });
            },
            handleEndExam(data){
                this.$Modal.confirm({
                    title:'友情提示',
                    content:'确定要结束本次考试吗?',
                    onOk:()=>{
                        endExam(this.examData).then(res=>{
                            if(res.data.code === 10000){
                                this.$Message.success(res.data.message);
                                this.value = false;
                                this.$parent.getExamList(this.$parent.params);
                            }else{
                                this.$Message.error(res.data.message);
                            }

                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>