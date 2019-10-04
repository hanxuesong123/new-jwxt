<template>
    <div>
        <Card :bordered="false" :dis-hover="true">

            <Tag color="warning" style="height:32px;text-align: center;margin-right: 15px;padding-top: 5px">日测笔试监控</Tag>
            <DatePicker @on-change="dateChange" type="date" :clearable="false"placeholder="请选择时间"></DatePicker>
            <span style="margin: 0px 15px 0px 15px">所选日期:{{computed_date}}</span>
            <Select v-model="params.classesId" placeholder="请选择班级" style="width: 200px;margin-right: 15px">
                <Option v-for="classes in classesArray" :value="classes.id" :key="classes.id">{{classes.className}}</Option>
            </Select>
            <Button type="primary" icon="ios-search" @click="getList(params)">查询数据</Button>
        </Card>
        <Card :bordered="false" :dis-hover="true">
            <Table :data="data" :columns="columns" :border="true" size="small"></Table>
        </Card>
    </div>
</template>

<script>

    import { getDays,formatTime,getDay } from "@/utils/tools";
    import { getDayExamList } from "@/api/academic/supervise";
    import { findClasses } from "@/api/quality/classes";

    export default {
        name: "score_supervise",
        data(){
            return {
                params:{
                    date:new Date(),
                    classesId:''
                },
                data:[],
                classesArray:[]
            }
        },
        computed:{
            computed_date(){
              return formatTime(this.params.date);
            },
            columns(){
                let arr = [];
                let date = this.params.date;
                let days = getDays(date);
                arr.push({fixed:'left',key:'className',width:'100px', title:'班级',align:'center'});
                arr.push({fixed:'left',key:'nickName',width:'100px', title:'姓名',align:'center'});
                for(let i = 1 ; i <= days ; i ++){
                    arr.push({width:'70px',key:'col'+ i,title:i,align:'center'});
                }
                arr.push({fixed:'left',key:'one_avg',width:'100px', title:'个人平均分',align:'center'})
                return arr;
            },
        },
        methods:{
            getList(data){
                getDayExamList(data).then(res=>{
                    if(res.data && res.data.data){
                        this.data = res.data.data
                    }else{
                        this.data = [];
                    }
                });
            },
            dateChange(date){
                this.params.date = new Date(date);
            }
        },
        created() {
            findClasses().then(res=>this.classesArray = res.data.data);
        }
    }
</script>

<style scoped>

</style>