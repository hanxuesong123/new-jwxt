<template>
    <div>
        <Drawer v-model="value1" :mask="false" title="批阅问答题" :closable="true"  :width="750" style="z-index: 10900;position: absolute">
            <template slot="header">
                <Button type="error" @click="handleEndExam(examData)">结束考试</Button>
            </template>
            <Scroll :height="900">
                <Card v-for="item in data.list" :key="item.user.id" style="margin-bottom: 10px;background-color: #D3D7D5">
                    <template slot="title">
                    <span>
                        <Input v-model="askScore" style="width: 250px">
                            <span slot="prepend" style="color: blue"> <b>{{item.user.nickName}}</b> </span>
                            <Button  slot="append" @click="handleSubmit(item.score)" :disabled="item.score.askScore > 0 || item.score.status == '0'">提交(单人全题总分)</Button>
                        </Input>
                    </span>
                    </template>
                    <Scroll>
                        <Card v-for="(answer,index) in item.list" :key="index" :bordered="false" :dis-hover="true" style="margin-bottom: 5px" >
                            <span style="margin-right: 10px;color: red">第{{index + 1}}题</span>{{answer == null ? '暂无任何内容!' :  answer.askAnswer}}
                        </Card>
                    </Scroll>
                </Card>
            </Scroll>
        </Drawer>

        <Drawer  title="问答题题干" v-model="value" placement="left" :closable="false" :width="650" style="background-color: #2d8cf0">
            <Scroll :height="900">
                <Card v-for="(ask,index) in data.asks" :key="ask.id" style="width: 550px;background-color: #D3D7D5;margin-bottom: 10px">
                    <template slot="title">问答题({{index + 1}})</template>
                    <Card :bordered="false" :dis-hover="true"> {{ask.askContent}}</Card>
                </Card>
            </Scroll>
        </Drawer>

    </div>
</template>

<script>

    import { readStudentAsks,lastExam,endExam } from "@/api/academic/exam";

    export default {
        name: "read-exam",
        data(){
            return {
                askScore:0,
                value : false,
                value1: false,
                examData:{},
                data:[]
            }
        },
        watch:{
            value(data){
                if(data){
                    readStudentAsks(this.examData.id).then(res=>this.data = res.data.data);
                }
            }
        },
        methods:{
            handleSubmit(score){
                this.$Modal.confirm({
                    title:'友情提示',
                    content:'确定评分吗?',
                    loading:true,
                    onOk:()=>{
                        score.askScore = this.askScore;
                        lastExam(score).then(res=>{
                            this.$Message.info(res.data.message);
                            this.askScore = 0;
                        })
                    }
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
                                this.value1 = false;
                                this.$parent.getExamList(this.$parent.params);
                            }else{
                                this.$Message.error(res.data.message);
                                return Promise.reject("");
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