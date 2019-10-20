<template>
    <div>
        <Modal  v-model="value" ok-text="下一题" cancel-text="加入错题库" :width="800" :closable="true" title="努力一点点,离成功就近一点点"> <!-- :fullscreen="true" :footer-hide="true"  -->
            <Card v-if="params.type == '1'" :bordered="false" :dis-hover="true">
                <template slot="title">
                    <span style="margin-right: 5px">{{count + 1}} / {{question.length}}</span> <strong>{{question[count].singleContent}}</strong>
                </template>
                <RadioGroup v-model="studentAnswer" :vertical="true" style="margin-top: 10px">
                    <Radio label="1" :disabled="disabledValue">A: {{question[count].singleOptionA}}</Radio>
                    <Radio label="2" :disabled="disabledValue">B: {{question[count].singleOptionB}}</Radio>
                    <Radio label="3" :disabled="disabledValue">C: {{question[count].singleOptionC}}</Radio>
                    <Radio label="4" :disabled="disabledValue">D: {{question[count].singleOptionD}}</Radio>
                </RadioGroup> <br>
                <Tag :color="studentAnswer == question[count].singleAsk ? 'success':'error'" :style="{'marginTop':'10px','display': hiddenTag}">你的答案:   {{studentAnswer == 1 ? 'A' : (studentAnswer == 2 ? "B" : (studentAnswer == 3 ? "C" : "D"))}}</Tag><br>
                <Tag color="success" :style="{'display': hiddenTag}">正确答案:   {{question[count].singleAsk == 1 ? 'A' : (question[count].singleAsk == 2 ? "B" : (question[count].singleAsk == 3 ? "C" : "D"))}}</Tag>
            </Card>

            <Card v-if="params.type == '2'"  :bordered="false" :dis-hover="true">
                <template slot="title">
                    <span style="margin-right: 5px">{{count + 1}} / {{question.length}}</span> <strong>{{question[count].mutipleContent}}</strong>
                </template>
                <CheckboxGroup  v-model="mutipleAsk"  style="margin-top: 10px">
                    <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="1">A: {{question[count].mutipleOptionA}}</Checkbox><br>
                    <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="2">B: {{question[count].mutipleOptionB}}</Checkbox><br>
                    <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="3">C: {{question[count].mutipleOptionC}}</Checkbox><br>
                    <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="4">D: {{question[count].mutipleOptionD}}</Checkbox>
                </CheckboxGroup>
                <Tag :color='showMutipleAsk == question[count].handleMutipleAsk ? "success":"error"' :style="{'marginTop':'10px','display': hiddenTag}">你的答案:  {{formart_mutipleAsk(showMutipleAsk)}}</Tag><br>
                <Tag color="success" :style="{'display': hiddenTag}">正确答案:  {{formart_mutipleAsk(question[count].handleMutipleAsk)}}</Tag>
            </Card>

            <Card v-if="params.type == '3'" :bordered="false" :dis-hover="true">
                <template slot="title">
                    <span style="margin-right: 5px">{{count + 1}} / {{question.length}}</span> <strong>{{question[count].askContent}}</strong>
                </template>
                <Input v-model="noneContent" placeholder="可以把你的答案写在这里,上网查找资料与之对比" type="textarea"  />
            </Card>

            <Card v-if="params.type == '4'">
                <template slot="title">上机题</template>
            </Card>

            <template slot="footer">
                <Button @click="saveErrorQuestion({questionId:question[count].id,questionType:question[count].type,lessionId:question[count].lessionId})" :disabled="params.type != '3'" type="error">加入错题</Button>
                <Button type="success" @click="showAnswer" :disabled="params.type == '3' || params.type == '4'">查看答案</Button>
                <Button type="primary" @click="nextQuestion" :disabled="count == (question.length-1)">下一题</Button>
            </template>
        </Modal>
    </div>
</template>

<script>

    import { getRandomQuestionByChapter,saveQuestionToCache,saveErrorQuestion } from "@/api/student/exercise";

    export default {
        name: "exercise-question-info",
        data(){
            return {
                params:{},
                value :false,
                question:[],
                count : 0,
                noneContent:'',
                mutipleAsk:[],
                showMutipleAsk:'',
                studentAnswer:'',
                hiddenTag:'none',
                disabledValue : false,
            }
        },
        methods:{
            nextQuestion(){
                switch (this.question[this.count].type) {
                    case "1":
                        if(!this.studentAnswer){
                            this.$Message.error("请给出单选题答案");
                        }else{
                            if(this.studentAnswer){
                                let params = {id:this.question[this.count].id,lessionId:this.question[this.count].lessionId};
                                saveQuestionToCache(params);
                            }

                            if(this.studentAnswer != this.question[this.count].singleAsk){
                                let params = {
                                    questionId:this.question[this.count].id,
                                    questionType:this.question[this.count].type,
                                    lessionId:this.question[this.count].lessionId
                                };
                                this.$Notice.error({
                                    title: '友情提示',
                                    desc: '回答错误'
                                });
                                this.saveErrorQuestion(params);
                            }else{
                                this.$Notice.success({
                                    title: '友情提示',
                                    desc: '回答正确'
                                });
                            }
                            this.studentAnswer = "";
                            this.disabledValue = false;
                            this.hiddenTag = 'none';
                            this.count ++;
                        }
                        break;
                    case "2":
                        this.showMutipleAsk= "";
                        if(this.mutipleAsk.length == 0){
                            this.$Message.error("请给出多选题答案");
                        }else{
                            if(this.mutipleAsk.length > 0){
                                let params = {id:this.question[this.count].id,lessionId:this.question[this.count].lessionId};
                                saveQuestionToCache(params);
                            }

                            let okMutipleAsk = this.question[this.count].handleMutipleAsk.split(",");
                            if(this.mutipleAsk.sort().join(",") != okMutipleAsk.sort()){
                                let params = {
                                    questionId:this.question[this.count].id,
                                    questionType:this.question[this.count].type,
                                    lessionId:this.question[this.count].lessionId
                                };
                                this.$Notice.error({
                                    title: '友情提示',
                                    desc: '回答错误'
                                });
                                this.saveErrorQuestion(params);
                            }else{
                                this.$Notice.success({
                                    title: '友情提示',
                                    desc: '回答正确'
                                });
                            }
                            this.mutipleAsk = [];
                            this.disabledValue = false;
                            this.hiddenTag = 'none';
                            this.count ++;
                        }
                        break;
                    case "3":
                        let params = {id:this.question[this.count].id,lessionId:this.question[this.count].lessionId};
                        saveQuestionToCache(params);
                        this.disabledValue = false;
                        this.hiddenTag = 'none';
                        this.count ++;
                        break;
                    case "4":
                        break;
                }
            },
            showAnswer(){
                switch (this.question[this.count].type) {
                    case "1":
                        if(!this.studentAnswer){
                            this.$Message.error("请给出答案");
                        }else{
                            this.disabledValue = true;
                            this.hiddenTag = 'block';

                            if(this.studentAnswer != this.question[this.count].singleAsk){
                                let params = {
                                    questionId:this.question[this.count].id,
                                    questionType:this.question[this.count].type,
                                    lessionId:this.question[this.count].lessionId
                                };
                                this.$Notice.error({
                                    title: '友情提示',
                                    desc: '回答错误'
                                });
                                this.saveErrorQuestion(params);
                            }else{
                                this.$Notice.success({
                                    title: '友情提示',
                                    desc: '回答正确'
                                });
                            }
                        }
                        break;
                    case "2":
                        if(this.mutipleAsk.length == 0){
                            this.$Message.error("请给出答案");
                        }else{
                            this.disabledValue = true;
                            this.hiddenTag = 'block';
                            this.showMutipleAsk = this.mutipleAsk.sort().join(",");
                            let okMutipleAsk = this.question[this.count].handleMutipleAsk.split(",");
                            if(this.mutipleAsk.sort().join(",") != okMutipleAsk.sort()){
                                let params = {
                                    questionId:this.question[this.count].id,
                                    questionType:this.question[this.count].type,
                                    lessionId:this.question[this.count].lessionId
                                };
                                this.$Notice.error({
                                    title: '友情提示',
                                    desc: '回答错误'
                                });
                                this.saveErrorQuestion(params);
                            }else{
                                this.$Notice.success({
                                    title: '友情提示',
                                    desc: '回答正确'
                                });
                            }
                        }
                        break;
                    case "3":
                        break;
                    case "4":
                        break;
                }
            },
            saveErrorQuestion(params){
                saveErrorQuestion(params);
                this.$Notice.error({
                    title: '友情提示',
                    desc: '已加入错题集'
                });
            },
            formart_mutipleAsk(data){ //处理多选题答案的工具方法
                let array = [];
                if(data.includes("1")){ //1,3 A,C
                    array.push("A");
                }
                if(data.includes("2")){
                    array.push("B");
                }
                if(data.includes("3")){
                    array.push("C");
                }
                if(data.includes("4")){
                    array.push("D");
                }

                return array.join(",");

            }
        }
    }
</script>

<style scoped>

</style>