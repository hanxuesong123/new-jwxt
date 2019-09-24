<template>
    <div>
        <Modal v-model="value"  :closable="true" :fullscreen="true" :footer-hide="true" :loading="loading">
            <!--单选题-->
            <Card v-if="examData.singleCount && examData.singleCount > 0 && questionArray.singleList.length > 0"
                  style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white"  :bordered="false" :dis-hover="true">
                <h2>单选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.singleCount}}道</h2>
            </Card>

            <Card v-if="examData.singleCount && examData.singleCount > 0 && questionArray.singleList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                <Card v-for="(single,index) in questionArray.singleList" :key="single.id" style="margin-bottom: 50px"  :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3>单选题第{{index + 1}}题:  {{single.singleContent}}</h3>
                    </template>
                    <RadioGroup v-model="singleAsk[index]" :vertical="true" style="margin-top: 10px"  >
                        <Radio label="1" disabled="disabled">A: {{single.singleOptionA}}</Radio>
                        <Radio label="2" disabled="disabled">B: {{single.singleOptionB}}</Radio>
                        <Radio label="3" disabled="disabled">C: {{single.singleOptionC}}</Radio>
                        <Radio label="4" disabled="disabled">D: {{single.singleOptionD}}</Radio>
                    </RadioGroup>


                    <!--<Card style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: left;color: white"  :bordered="false" :dis-hover="true">

                    </Card>-->
                    <Card  :bordered="false" :dis-hover="true">
                        <Tag color="success">
                            <span>正确答案:{{single.singleAsk  == '1' ? 'A' : (single.singleAsk == '2' ? 'B' : (single.singleAsk == '3' ? 'C' : 'D'))}}</span>
                        </Tag>
                    </Card>


                </Card>
            </Card>

            <!--多选题-->
            <Card v-if="examData.mutipleCount && examData.mutipleCount > 0 && questionArray.mutipleList.length > 0"
                  style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white"  :bordered="false" :dis-hover="true">
                <h2>多选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.mutipleCount}}道</h2>
            </Card>

            <Card v-if="examData.mutipleCount && examData.mutipleCount > 0 && questionArray.mutipleList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                <Card v-for="(mutiple,index) in questionArray.mutipleList" :key="mutiple.id" style="margin-bottom: 50px"   :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3>多选题第{{index + 1}}题:  {{mutiple.mutipleContent}}</h3>
                    </template>
                    <CheckboxGroup  v-model="mutipleAsk[index]"  style="margin-top: 10px">
                        <Checkbox style="margin-bottom: 10px" label="1" disabled="disabled">A: {{mutiple.mutipleOptionA}}</Checkbox><br>
                        <Checkbox style="margin-bottom: 10px" label="2" disabled="disabled">B: {{mutiple.mutipleOptionB}}</Checkbox><br>
                        <Checkbox style="margin-bottom: 10px" label="3" disabled="disabled">C: {{mutiple.mutipleOptionC}}</Checkbox><br>
                        <Checkbox style="margin-bottom: 10px" label="4" disabled="disabled">D: {{mutiple.mutipleOptionD}}</Checkbox>
                    </CheckboxGroup>

                    <Card  :bordered="false" :dis-hover="true">
                        <Tag color="success">
                            <span>正确答案:{{formart_mutipleAsk(mutiple.mutipleAsk)}} </span>
                        </Tag>
                    </Card>
                </Card>
            </Card>

            <!--问答题-->
            <Card v-if="examData.askCount && examData.askCount > 0 && questionArray.askList.length > 0"
                  style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white"  :bordered="false" :dis-hover="true">
                <h2>问答题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.askCount}}道</h2>
            </Card>

            <Card v-if="examData.askCount && examData.askCount > 0 && questionArray.askList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                <Card v-for="(ask,index) in questionArray.askList" :key="ask.id" style="margin-bottom: 50px" :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3><Tag color="success">问答题第{{index + 1}}题:</Tag>  {{ask.askContent}}</h3>
                    </template>
                </Card>
            </Card>

        </Modal>
    </div>
</template>
<script>

    import { showObjectExam } from "@/api/academic/exam";

    import { goBackStudentExamData } from "@/api/student/exam";

    import { getQuestionExamTeacherList } from "@/api/academic/exam";

    export default {
        name:'show-student-exam',
        props:['parent'],
        data(){
            return {
                loading:true,
                value : false,
                examData:{singleCount:0,mutipleCount:0,askCount:0,questionTypeIds:''}, //当前试卷实例
                questionArray:{singleList:[],mutipleList:[],askList:[]},
                //questionArray:[],
                singleAsk:[], //学生单选题情况
                mutipleAsk:[],//学生多选题情况
                askAsk:[], //学生简答题情况
                student:false
            }
        },
        watch:{
            value(data){
                getQuestionExamTeacherList(this.examData).then(res=>this.questionArray = res.data.data); //查询当前试卷的所有试题
            },
            student(data){
                if(data == true && this.value == true){ //用于数据回显
                    goBackStudentExamData(this.examData).then(res=>{
                        console.log(res.data.data)
                    })
                }
            }
        },
        methods:{
            formart_mutipleAsk(data){
                let array = [];

                if(data.includes("1")){
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
<style>

</style>