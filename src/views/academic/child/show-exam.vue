<template>
    <div>
        <Drawer v-model="value" :closable="false" :width="1000">
            <Card style="height: 300px" :bordered="false" :dis-hover="true">
                <template slot="title">试卷信息</template>


            </Card>
            <Card :bordered="false" :dis-hover="true">
                <template slot="title">
                    <span>考生信息</span>
                    <Tooltip content="刷新">
                        <Button style="margin-left: 10px" type="primary" shape="circle" icon="md-refresh" ghost size="small" @click="showExam"></Button>
                    </Tooltip>
                    <span style="margin-left: 10px">已交({{alreadyHand}}/{{studentArray.length}})</span>
                    <span style="margin-left: 10px">未交({{noHand}}/{{studentArray.length}})</span>
                    <span style="margin-left: 10px">未答题({{noAnswer}}/{{studentArray.length}})</span>
                    <Tooltip content="停止考试">
                        <Button :disabled="examData.examType == 2" style="margin-left: 10px" type="error" shape="circle" icon="ios-hand" ghost size="small" @click="stopExam">停止考试</Button>
                    </Tooltip>
                </template>
                <Scroll :height="500">
                    <Table :data="studentArray" :columns="columns" :border="true" :loading="loading"></Table>
                </Scroll>
            </Card>

        </Drawer>
    </div>
</template>

<script>

    import { showExam } from "@/api/academic/exam";

    export default {
        name: "show-exam",
        data(){
            return {
                value : false,
                examData:{},
                studentArray:[],
                loading:true,
            }
        },
        watch:{
            value(data){
                if(data){
                    this.showExam();
                }
            }
        },
        methods:{
          showExam(){
              showExam(this.examData).then(res=>{
                  this.studentArray = res.data.data;
                  this.loading = false;
              })
          },
          stopExam(){
            alert("A")
          }
        },
        computed:{

            alreadyHand(){ //已交人数
                return this.studentArray.filter(item=>{
                    return item.status == '2'
                }).length;
            },
            noHand(){ //没有上交
                return this.studentArray.filter(item=>{
                    return item.status == '1'
                }).length;
            },
            noAnswer(){
                return this.studentArray.filter(item=>{
                    return item.status == '0'
                }).length;
            },
            columns(){
                return [
                    {type:'index',title:'序号',align:'center'},
                    {key:'studentName',title:'学生姓名',align:'center'},
                    {key:'single',title:'单选题',align:'center',children:[
                        {key:'singleErr',title:'错题量',align:'center'},
                        {key:'singleSucc',title:'对题量',align:'center'},
                    ]},
                    {key:'mutiple',title:'多选题',align:'center',children:[
                        {key:'multipleErr',title:'错题量',align:'center'},
                        {key:'multipleSucc',title:'对题量',align:'center'},
                    ]},
                    {key:'status',title:'是否交卷',align:'center',render(h,params){
                        return h('Tag',
                            {props:{color:params.row.status == "0" ? "error" : (params.row.status == "1" ? 'success':"warning")}},
                            params.row.status == "0" ? "未答题" : (params.row.status == "1" ? '正在答题':"已交卷"));
                    }},
                ];
            }
        }
    }
</script>

<style scoped>

</style>