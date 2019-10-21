<template>
    <div>
        <Modal v-model="value" :fullscreen="true" :footer-hide="true" :closable="true" title="努力一点点,离成功就近一点点">
            <CellGroup>
                <Cell :key="item.id" v-for="item in data">
                    <span style="margin-right: 20px">{{item.name}}</span>
                    <Progress :hide-info="true" style="width: 900px;margin-right: 20px" :percent="Math.ceil(item.okCount / item.totalCount * 100)" :stroke-width="5"/> <span style="margin-right: 20px">{{item.okCount}} / {{item.totalCount}}</span>
                    <Button style="float: right" @click="openQuestionWindow('1',item.id)" type="primary" size="small">要刷单选</Button>
                    <Button style="margin-right: 20px;float: right" @click="openQuestionWindow('2',item.id)" type="primary" size="small">要刷多选</Button>
                    <Button style="margin-right: 20px;float: right" @click="openQuestionWindow('3',item.id)" type="primary" size="small">要刷问答</Button>
                    <Button style="margin-right: 20px;float: right" @click="openQuestionWindow('4',item.id)" type="primary" size="small">要刷上机</Button>
                </Cell>
            </CellGroup>
        </Modal>

        <exercise-question-info ref="exerciseQuestionInfo"></exercise-question-info>
    </div>
</template>

<script>

    import { getChapters,getRandomQuestionByChapter,queryStudentExamStatus } from "@/api/student/exercise";

    export default {
        name: "exercise-question",
        components:{
            ExerciseQuestionInfo:()=>import("@/views/student/exam/exercise-question-info.vue")
        },
        data(){
            return {
                value : false,
                stageId:'',
                data: []
            }
        },
        watch:{
            value(data){
                if(data && this.stageId != ''){
                    getChapters(this.stageId).then(res=>{
                        if(res.data.code == 10000){
                            this.data = res.data.data;
                        }
                    });
                }
            }
        },
        methods:{
            openQuestionWindow(type,chapterId){
                if(type == '4'){
                    this.$Message.info('暂不支持上机刷题');
                    return false;
                }
                //TODO: 是否有考试的试卷,如果有,不能答题
                queryStudentExamStatus().then(res=>{
                   if(res.data.code == 56789){
                       this.$Modal.success({
                           title:'友情提示',
                           content:'有未结束的考试,无法进入刷题'
                       });
                       return false;
                   }else{
                       let params = {type:type,chapterId:chapterId};
                       this.$refs['exerciseQuestionInfo'].params = params;

                       getRandomQuestionByChapter(params).then(res=>{
                           if(res.data.code == 10000){
                               if(res.data.data.length == 0){
                                   this.$Message.error("该课程没有试题");
                                   return false;
                               }else{
                                   this.$refs['exerciseQuestionInfo'].count = 0;
                                   this.$refs['exerciseQuestionInfo'].successQuestionCount = 0;
                                   this.$refs['exerciseQuestionInfo'].studentAnswer = '';
                                   this.$refs['exerciseQuestionInfo'].mutipleAsk = [];
                                   this.$refs['exerciseQuestionInfo'].disabledValue = false;
                                   this.$refs['exerciseQuestionInfo'].hiddenTag = 'none';
                                   this.$refs['exerciseQuestionInfo'].question = res.data.data;
                                   this.$refs['exerciseQuestionInfo'].value = true;
                               }
                           }
                       });
                   }
                });
            }
        }
    }
</script>

<style scoped>
    span{
        width: 250px;
        display: inline-block;
    }
</style>