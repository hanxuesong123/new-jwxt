<template>
    <div>
        <Modal v-model="value"  :closable="false" :fullscreen="true" :footer-hide="true" :loading="loading">
            <Row>
                <Col :span="24">
                    <!--进度条-->
                    <Affix>
                        <Card :bordered="false" :dis-hover="true">
                            <Progress :percent="number.total" />
                        </Card>
                    </Affix>
                </Col>
            </Row>
            <Row>
                <Col :span="4">
                    <!--答题卡  @click.native="badgeClick('single',item)"-->
                    <Card  style="text-align: center;padding: 0px;margin-top: 30px;margin-left: 50px" :bordered="false">
                        <template slot="title"><h2 style="color: #42b983">答题卡</h2></template>
                        <Divider v-if="examData.questionTypeIds.includes('1')" orientation="left">单选题</Divider>
                        <Badge
                                :ref="'single' + item"
                                v-if="examData.singleCount && examData.singleCount > 0"
                                v-for="item in examData.singleCount"
                                style="margin: 5px 5px 5px 5px"
                                :key="item"
                                text=""
                                type="success"
                                :count="item"
                        ></Badge>
                        <Divider v-if="examData.questionTypeIds.includes('2')" orientation="left">多选题</Divider>

                        <Badge
                                v-if="examData.mutipleCount && examData.mutipleCount > 0"
                                v-for="item in examData.mutipleCount"
                                style="margin: 5px 5px 5px 5px"
                                :key="'mutiple'+item"
                                text=""
                                type="success"
                                :count="item"
                        ></Badge>

                        <Divider v-if="examData.questionTypeIds.includes('3')" orientation="left">问答题</Divider>

                        <Badge
                                v-if="examData.askCount && examData.askCount > 0"
                                v-for="item in examData.askCount"
                                style="margin: 5px 5px 5px 5px"
                                :key="'ask'+item"
                                text=""
                                type="success"
                                :count="item"
                        ></Badge>
                        <Card style="background-color: #42b983;color: white;font-size: 15px;margin-top: 10px" @click.native="handleSubmit"><h1>交卷</h1></Card>
                    </Card>
                </Col>


                <Col :span="20">
                    <!--试题内容-->
                    <Scroll :height="900">
                        <!--单选题-->
                        <Card v-if="examData.singleCount && examData.singleCount > 0 && questionArray.singleList.length > 0"
                              style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white">
                            <h2>单选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.singleCount}}道</h2>
                        </Card>

                        <Card v-if="examData.singleCount && examData.singleCount > 0 && questionArray.singleList.length > 0"
                              style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                            <Card v-for="(single,index) in questionArray.singleList" :key="single.id" style="margin-bottom: 50px" :bordered="false">
                                <template slot="title">
                                    <h3>第{{index + 1}}题:  {{single.singleContent}}</h3>
                                </template>
                                <RadioGroup v-model="singleAsk[index]" :vertical="true" style="margin-top: 10px" @on-change="singleChange">
                                    <Radio label="1">A: {{single.singleOptionA}}</Radio>
                                    <Radio label="2">B: {{single.singleOptionB}}</Radio>
                                    <Radio label="3">C: {{single.singleOptionC}}</Radio>
                                    <Radio label="4">D: {{single.singleOptionD}}</Radio>
                                </RadioGroup>
                            </Card>
                        </Card>

                        <!--多选题-->
                        <Card v-if="examData.mutipleCount && examData.mutipleCount > 0 && questionArray.mutipleList.length > 0"
                              style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white">
                            <h2>多选题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.mutipleCount}}道</h2>
                        </Card>

                        <Card v-if="examData.mutipleCount && examData.mutipleCount > 0 && questionArray.mutipleList.length > 0"
                              style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                            <Card v-for="(mutiple,index) in questionArray.mutipleList" :key="mutiple.id" style="margin-bottom: 50px"  :bordered="false">
                                <template slot="title">
                                    <h3>第{{index + 1}}题:  {{mutiple.mutipleContent}}</h3>
                                </template>
                                <CheckboxGroup  v-model="mutipleAsk[index]"  style="margin-top: 10px">
                                    <Checkbox style="margin-bottom: 10px" label="1">A: {{mutiple.mutipleOptionA}}</Checkbox><br>
                                    <Checkbox style="margin-bottom: 10px" label="2">B: {{mutiple.mutipleOptionB}}</Checkbox><br>
                                    <Checkbox style="margin-bottom: 10px" label="3">C: {{mutiple.mutipleOptionC}}</Checkbox><br>
                                    <Checkbox style="margin-bottom: 10px" label="4">D: {{mutiple.mutipleOptionD}}</Checkbox>
                                </CheckboxGroup>
                            </Card>
                        </Card>

                        <!--问答题-->
                        <Card v-if="examData.askCount && examData.askCount > 0 && questionArray.askList.length > 0"
                              style="height: 50px;background-color: #42b983;margin-left: 30px;margin-top: 30px;text-align: center;color: white">
                            <h2>问答题&nbsp;&nbsp;&nbsp;&nbsp;共{{examData.askCount}}道</h2>
                        </Card>

                        <Card v-if="examData.askCount && examData.askCount > 0 && questionArray.askList.length > 0"
                              style="margin-top: 30px;margin-left: 30px" :bordered="false" :dis-hover="true">
                            <Card v-for="(ask,index) in questionArray.askList" :key="ask.id" style="margin-bottom: 50px">
                                <template slot="title">
                                    <h3>第{{index + 1}}题:  {{ask.askContent}}</h3>
                                </template>
                                <Input v-model="askAsk[index]" placeholder="请写出你的答案" type="textarea"  />
                            </Card>
                        </Card>
                    </Scroll>
                </Col>
            </Row>
        </Modal>
    </div>
</template>
<script>

    import { getQuestionExamList,saveExam,getExamStatus } from "@/api/student/exam";
    import { splice } from "@/utils/tools";

    export default {
        name:'show-student-exam',
        props:['parent'],
        data(){
            return {
                loading:true,
                value : false,
                examData:{singleCount:0,mutipleCount:0,askCount:0,questionTypeIds:''}, //当前试卷实例
                number:{total:0,single:0,mutiple:0,ask:0}, //计算进度条的参数
                questionArray:{singleList:[],mutipleList:[],askList:[]},
                singleAsk:[], //学生单选题情况
                mutipleAsk:[],//学生多选题情况
                askAsk:[], //学生简答题情况
                timer:'',//定时器
            }
        },
        computed:{
            circle(){ //总题数
                let singleCount = this.examData.singleCount || 0;
                let mutipleCount = this.examData.mutipleCount || 0;
                let askCount = this.examData.askCount || 0;
                return singleCount + mutipleCount + askCount;
            }
        },
        watch:{
            value(data){
                this.timer = setInterval(()=>{
                    getExamStatus(this.examData.id).then(res=>{
                        if(res.data.data.examStatus != 2){
                            //this.value = false;
                            this.$router.push('/');
                            this.submitExam();
                            this.$destroy('show-student-exam');
                        };
                    })
                },1000 * 5);
                getQuestionExamList(this.examData).then(res=>this.questionArray = res.data.data); //查询当前试卷的所有试题
                //打开页面后, 所有单选题答案默认为5,没填写就给5 如果填写了就替换5
                if(this.examData.singleCount && this.examData.singleCount > 0) for(let i = 0 ; i < this.examData.singleCount ; i ++) this.singleAsk.push(5);
                if(this.examData.mutipleCount && this.examData.mutipleCount > 0) for(let i = 0 ; i < this.examData.mutipleCount; i ++) this.mutipleAsk.push(["5"]);//在提交试卷时,需要判断当前选项的数组长度,如果长度大于1,则把5删掉
                if(this.examData.askCount && this.examData.askCount > 0) for(let i = 0 ; i < this.examData.askCount ; i ++) this.askAsk.push("暂无任何内容");
                //this.toggleFullScreen();
            },
            singleAsk(data){ //监听单选题选项 如果学生操作单选题,则影响进度条
                if(data && data.length > 0){
                    let count = this.singleAsk.filter(item=>{return item != 5;}).length;
                    this.number.single = count;
                    this.number.total = Math.ceil(((count + this.number.mutiple + this.number.ask ) / this.circle) * 100);
                }
            },
            mutipleAsk(data){//监听多选题选项 如果学生操作多选题,则影响进度条
                if(data && data.length > 0){
                    let count = this.mutipleAsk.filter(item=>{return  item.length > 1;}).length;
                    this.number.mutiple = count;
                    this.number.total = Math.ceil(((this.number.single + count + this.number.ask ) / this.circle) *100 )
                }
            },
            askAsk(data){//监听问答题 如果学生操作问答题,则影响进度条
                if(data && data.length > 0){
                    let count = this.askAsk.filter(item=>{return !item.includes("暂无任何内容");}).length;
                    this.number.ask = count;
                    this.number.total = Math.ceil(((this.number.single + this.number.mutiple + count) / this.circle) * 100)
                }
            }
        },
        methods:{
            singleChange(){ //单选改变时触发

            },
            submitExam(){
                //处理对选题数据
                if(this.mutipleAsk && this.mutipleAsk.length > 0){
                    this.mutipleAsk.forEach(mutipleArray=>{
                        if(mutipleArray.length > 1){
                            mutipleArray = splice(mutipleArray);
                        }
                    })
                }
                saveExam({id:this.examData.id,single:this.singleAsk.join(","),mutiple:this.mutipleAsk.join("@"),ask:this.askAsk.join(",")}).then(res=>{
                    if(res.data.code === 10000){
                        this.$Message.success(res.data.message);
                    }else{
                        this.$Message.success(res.data.message);
                    }

                    this.examData = {singleCount:0,mutipleCount:0,askCount:0,questionTypeIds:''}; //当前试卷实例
                    this.number = {total:0,single:0,mutiple:0,ask:0}; //计算进度条的参数
                    this.questionArray={singleList:[],mutipleList:[],askList:[]};
                    this.singleAsk=[]; //学生单选题情况
                    this.mutipleAsk=[];//学生多选题情况
                    this.askAsk=[]; //学生简答题情况

                    this.value = false;
                    this.$parent.getList(this.$parent.params);
                })
            },
            handleSubmit(){
                this.$Modal.confirm({
                    title:'友情提示',
                    content:'你确定要提交试卷吗?',
                    onOk:()=>{
                        this.submitExam();
                    }
                })
            },
            toggleFullScreen(){
                if (!document.fullscreenElement &&
                    !document.mozFullScreenElement && !document.webkitFullscreenElement) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
        }
    }
</script>
<style>

</style>