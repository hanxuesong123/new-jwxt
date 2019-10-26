<template>
    <div>
        <Modal v-model="value"  :closable="true" :fullscreen="true" :footer-hide="true" :loading="loading">

            <Affix v-if="studentResultArray.score.status != '0'"  style="margin-left: 30px;height: 150px">
                <Card   style="height: 150px" :bordered="false" :dis-hover="true">
                       <Row>
                           <Col :span="12" style="text-align: center">
                               <span>你的总分是:</span>
                               <count-to  :start-val="0" :end-val="studentResultArray.score.score" :duration="3000" class="count-to-class"></count-to>
                               <span>分</span>
                           </Col>

                           <Col :span="12">
                               <Row>
                                   <Col :span="12">
                                       <span>单选题对题:</span>
                                       <count-to  :start-val="0" :end-val="studentResultArray.score.singleSucc" :duration="3000" class="count-to-sub-class"></count-to>
                                       <span>道</span>
                                   </Col>
                                   <Col :span="12">
                                       <span>多选题对题:</span>
                                       <count-to  :start-val="0" :end-val="studentResultArray.score.multipleSucc" :duration="3000" class="count-to-sub-class"></count-to>
                                       <span>道</span>
                                   </Col>
                               </Row>
                               <Row>
                                   <Col :span="12">
                                       <span>单选题错题:</span>
                                       <count-to  :start-val="0" :end-val="studentResultArray.score.singleErr" :duration="3000" class="count-to-sub-class"></count-to>
                                       <span>道</span>
                                   </Col>
                                   <Col :span="12">
                                       <span>多选题错题:</span>
                                       <count-to  :start-val="0" :end-val="studentResultArray.score.multipleErr" :duration="3000" class="count-to-sub-class"></count-to>
                                       <span>道</span>
                                   </Col>
                               </Row>
                           </Col>
                       </Row>
                </Card>
            </Affix>




            <!--单选题-->
            <Card v-if="examData.singleCount && examData.singleCount > 0 && questionArray.singleList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">

                <template slot="title" style="background-color: #ff6600">
                    <h3 style="font-size: 20px; background-color: #888989;color: white;height: 50px;text-align: center;padding:15px 0px 0px 0px">单选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.singleCount}}道</h3>
                </template>

                <Card v-for="(single,index) in questionArray.singleList" :key="single.id" style="margin-bottom: 50px"  :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3>   单选题第{{index + 1}}题:  {{single.singleContent}}</h3>
                    </template>
                    <RadioGroup v-model="singleAsk[index]" :vertical="true" style="margin-top: 10px"  >
                        <Radio label="1" disabled="disabled">A: {{single.singleOptionA}}</Radio>
                        <Radio label="2" disabled="disabled">B: {{single.singleOptionB}}</Radio>
                        <Radio label="3" disabled="disabled">C: {{single.singleOptionC}}</Radio>
                        <Radio label="4" disabled="disabled">D: {{single.singleOptionD}}</Radio>
                    </RadioGroup>


                    <Card  :bordered="false" :dis-hover="true">
                        <Tag color="pink">
                            <span>你的答案:{{ studentResultArray.single[index] != null ?  format_single(studentResultArray.single[index].optionIds) : "未答题" }}</span>
                        </Tag>
                        <Tag color="success">
                            <span>正确答案:{{single.singleAsk  == '1' ? 'A' : (single.singleAsk == '2' ? 'B' : (single.singleAsk == '3' ? 'C' : 'D'))}}</span>
                        </Tag>
                    </Card>


                </Card>
            </Card>

            <!--多选题-->

            <Card v-if="examData.mutipleCount && examData.mutipleCount > 0 && questionArray.mutipleList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">

                <template slot="title" style="background-color: #ff6600">
                    <h3 style="font-size: 20px; background-color: #888989;color: white;height: 50px;text-align: center;padding:15px 0px 0px 0px">多选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.mutipleCount}}道</h3>
                </template>


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
                        <Tag color="pink">
                            <span>你的答案:{{  studentResultArray.mutiple[index] != null ? format_mutipleAsk(studentResultArray.mutiple[index].optionIds) : '未答题' }}</span>
                        </Tag>
                        <Tag color="success">
                            <span>正确答案:{{format_mutipleAsk(mutiple.handleMutipleAsk)}} </span>
                        </Tag>

                    </Card>
                </Card>
            </Card>

            <!--问答题-->

            <Card v-if="examData.askCount && examData.askCount > 0 && questionArray.askList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">

                <template slot="title" style="background-color: #ff6600">
                    <h3 style="font-size: 20px; background-color: #888989;color: white;height: 50px;text-align: center;padding:15px 0px 0px 0px">问答题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.askCount}}道</h3>
                </template>

                <Card v-for="(ask,index) in questionArray.askList" :key="ask.id" style="margin-bottom: 50px" :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3>第{{index + 1}}题:&nbsp;&nbsp;&nbsp; {{ask.askContent}}</h3>
                    </template>
                    <p>{{studentResultArray.ask[index].askAnswer || "没有填写任何答案" }}</p>
                </Card>
            </Card>


            <Card v-if="examData.upperCount && examData.upperCount > 0 && questionArray.upperList.length > 0"
                  style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white"  :bordered="false" :dis-hover="true">
                <h2>上机题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.upperCount}}道</h2>
            </Card>

            <Card v-if="examData.upperCount && examData.upperCount > 0 && questionArray.upperList.length > 0"
                  style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                <Card v-for="(upper,index) in questionArray.upperList" :key="upper.id" style="margin-bottom: 50px" :bordered="false" :dis-hover="true">
                    <template slot="title">
                        <h3><Tag color="success">上机题第{{index + 1}}题:</Tag>  {{upper.upperContent}}</h3>
                        <!--<Input v-model="studentResultArray.ask[index].askAnswer" placeholder="暂无答案" type="textarea" :disabled="true" >-->
                    </template>
                </Card>
            </Card>

        </Modal>
    </div>
</template>
<script>

    import { getAnswerQuestionStudentList,goBackStudentExamData } from "@/api/student/exam";

    export default {
        name:'show-student-exam',
        props:['parent'],
        data(){
            return {
                loading:true,
                value : false,
                examData:{singleCount:0,mutipleCount:0,askCount:0,questionTypeIds:''}, //当前试卷实例
                questionArray:{singleList:[],mutipleList:[],askList:[],upperList:[]},
                //questionArray:[],
                singleAsk:[], //学生单选题情况
                mutipleAsk:[],//学生多选题情况
                askAsk:[], //学生简答题情况
                student:false,
                studentResultArray:{single:[],mutiple:[],ask:[],score:''}//学生所有答题集合,用于数据回显
            }
        },
        watch:{
            value(data){
                if(data){
                    getAnswerQuestionStudentList(this.examData).then(res=>this.questionArray = res.data.data); //查询当前试卷的所有试题

                    goBackStudentExamData(this.examData).then(res=>{
                        let { askResults ,mutipleResults , singleResults,score} = res.data.data;
                        this.studentResultArray.ask = askResults;
                        this.studentResultArray.single = singleResults;
                        this.studentResultArray.mutiple = mutipleResults;
                        this.studentResultArray.score = score;
                    })
                }
            }
        },
        methods:{

            format_single(data){
                if(data){
                    if(data == '1'){
                        return 'A';
                    }else if(data == '2'){
                        return 'B';
                    }else if(data == '3'){
                        return 'C';
                    }else if(data == '4'){
                        return 'D';
                    }else if(data == '5'){
                        return "未答";
                    }
                }else{
                    return "未答";
                }
            },

            format_mutipleAsk(data){ //处理多选题答案的工具方法
                let array = [];

                if(data){
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


                    if(data.includes("5")){
                        array.push("未答题");
                    }

                    return array.join(",");
                }else{
                    array.push("未答题");
                    return array.join("");
                }

            }
        }
    }
</script>
<style>
    .count-to-class{
        font-size: 80px;
        color: #30B08F;
        display: inline-block;
        margin: 10px 10px 10px 10px;
    }
    .count-to-sub-class{
        font-size: 40px;
        color: #30B08F;
        display: inline-block;
        margin: 10px 10px 10px 10px;
    }
</style>