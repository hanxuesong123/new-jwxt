<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <template slot="title">
                <Select v-model="params.type" :clearable="true" :filterable="true"  placeholder="请选择试题类型" style="margin-right: 10px;width:200px">
                    <Option value="1">单选题</Option>
                    <Option value="2">多选题</Option>
                    <Option value="3">问答题</Option>
                    <Option :disabled="true" value="4">上机题</Option>
                </Select>

                <Select v-model="params.stageId" :clearable="true" :filterable="true" @on-clear="onClear"  placeholder="请选择课程" style="margin-right: 10px;width:200px">
                    <Option :value="item.id" :key="item.id" v-for="item in stageArray">{{item.name}}</Option>
                </Select>

                <Select  :disabled="disabledChapter" :clearable="true" :filterable="true"  placeholder="请选择章节" v-model="params.chapterId" style="margin-right: 10px;width:200px">
                    <Option :value="item.id" :key="item.id" v-for="item in chapterArray.children">{{item.label}}</Option>
                </Select>

                <Input type="text" placeholder="请输入题干关键字" v-model="params.content" style="margin-right: 10px;width:200px" />

                <Button type="primary" ghost icon="md-search" @click="list(params)" style="margin-right: 10px">查询</Button>
                <Button type="primary" ghost icon="md-refresh" @click="params = {page:1,size:10,total:0},disabledChapter = true,chapterArray=[],list(params)">重置</Button>

            </template>

            <Card v-for="item in data" :key="item.id" style="height: 100px;padding-top: 20px;margin-bottom: 5px">
                <Row>
                    <Col :span="1">
                        <Tag :color="item.questionType == '1' ? 'pink' :(item.questionType == '2' ? 'warning' : (item.questionType == '3' ? 'error' : 'success'))">
                            {{item.questionType == '1' ? '单选题' :(item.questionType == '2' ? '多选题' : (item.questionType == '3' ? '问答题' : '上机题'))}}
                        </Tag>
                    </Col>
                    <Col :span="4">
                        <p style="margin-left: 5px">所属阶段: {{item.stageName}}</p>
                        <p style="margin-left: 5px">所属章节: {{item.chapterName}}</p>
                    </Col>
                    <Col :span="14">
                        {{item.content}}
                    </Col>
                    <Col :span="3">
                        {{formatTimeSelf(item.modifyTime)}}
                    </Col>
                    <Col :span="2">
                        <Button type="primary" icon="ios-eye" @click="showInfo(item)">查看</Button>
                    </Col>
                </Row>

            </Card>
            <Page
                    :current="params.page"
                    :page-size="params.size"
                    :total="params.total"
                    :show-total="true"
                    @on-change="pageChange"
                    @on-page-size-change="pageSizeChange">
            </Page>
        </Card>

        <exercise-error-info ref="exerciseErrorInfo"></exercise-error-info>


    </div>
</template>

<script>


    import { getStudentErrorQuestionList } from "@/api/student/exercise";
    import { findGeneralByCode } from "@/api/other/general";
    import { findChapterByCodeAndStage} from "@/api/other/general";
    import { formatTime } from "@/utils/tools";

    export default {
        name: "exercise-error",
        components:{
            ExerciseErrorInfo:()=>import("@/views/student/exam/exercise-error-info.vue")
        },
        data(){
            return {
                data:[
                   /* {id:'31232133',color:'red',content:'打算大苏打dsadajsdklasjdkasjdkasdjaskldjaskdjfkjdshgjhoiewrnfsdnskdfskdfs',type:'1',chapterName:'ES6-基础',stageName:'高并发',modifyTime:'2019-10-03 00:00:00'},
                    {id:'31232131',color:'red',content:'打算大苏打',type:'2',chapterName:'ES6-基础',stageName:'高并发',modifyTime:'2019-10-03 00:00:00'},
                    {id:'31232132',color:'red',content:'打算大苏打',type:'3',chapterName:'ES6-基础',stageName:'高并发',modifyTime:'2019-10-03 00:00:00'}*/
                ],
                params:{page:1,size:5,total:0},
                stageArray:[],
                chapterArray:[],
                disabledChapter:true
            }
        },
        watch:{
          'params.stageId'(data){
              if(data){
                  this.disabledChapter = false;
                  this.chapterArray = [];
                  findChapterByCodeAndStage({code:'CHAPTER',stageId:data}).then(res=>{
                      if(res.data.code = 10000){
                          this.chapterArray = (res.data.data)[0];
                      }
                  })
              }
          }
        },
        methods:{
            pageChange(page){
                this.params.page = page;
                this.list(this.params);
            },
            pageSizeChange(size){
                this.params.size = size;
                if(this.params.page == 1){
                    this.list(this.params);
                }
            },
            onClear(){
                this.disabledChapter = true;
                this.chapterArray = [];
            },
            formatTimeSelf(data){
                return formatTime(data);
            },
            list(params){
                getStudentErrorQuestionList(params).then(res=>{
                    if(res.data.code == 10000){
                        this.data = res.data.data.rows;
                        this.params.total = res.data.data.total;
                    }
                });
            },
            showInfo(data){
                this.$refs['exerciseErrorInfo'].data = data;
                this.$refs['exerciseErrorInfo'].value = true;
            }
        },
        created(){
           this.list(this.params);
            findGeneralByCode({code:'STAGE'}).then(res=>{
                if(res.data.code == 10000){
                    this.stageArray = res.data.data;
                }
            })
        }
    }
</script>

<style scoped>
    *{
        font-size: 15px;
    }
</style>