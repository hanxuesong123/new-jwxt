<template>
    <div>
        <Card :bordered="false" :dis-hover="true">

            <Tag color="warning" style="height:32px;text-align: center;margin-right: 15px;padding-top: 5px">日测笔试监控</Tag>
            <DatePicker @on-change="dateChange" type="date" :clearable="false" placeholder="请选择时间"></DatePicker>
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

    import { getDays,formatTime,getDay,getCountDays } from "@/utils/tools";
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
                let that = this;
                let arr = [];
                let date = this.params.date;
                let days = getDays(date);
                let data = {};
                arr.push({fixed:'left',key:'className',width:'100px', title:'班级',align:'center'});
                arr.push({fixed:'left',key:'nickName',width:'100px', title:'姓名',align:'center'});
                for(let i = 1 ; i <= days ; i ++){
                    arr.push({width:'70px',key:'col'+ i,title:i,align:'center'});
                }
                arr.push({fixed:'left',key:'svg',width:'100px', title:'个人平均分',align:'center'});
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
            },
            init() {
                let that = this;
                let myChart = this.$echarts.init(document.getElementById('myChart2'));  //实例化echarts容器
                // 绘制图表
                myChart.setOption({
                    title: { //标题项
                        show: true, //是否显示标题
                        text: '', //主标题
                        subtext: '', //副标题
                        textAlign: 'auto'//标题位置 left right center
                    },
                    color: ['#3398DB'], //图形颜色
                    tooltip: { //提示框组件
                        trigger: 'axis', //触发类型 'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                        axisPointer: {  // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',        // 指示器类型 'line' 直线指示器 'shadow' 阴影指示器 'none' 无指示器 'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
                            label: {
                                show: true    //强调x轴文本标签
                            }
                        }
                    },
                    grid: {
                        left: '3%', //组件离容器左侧的距离
                        right: '4%', //组件离容器右侧的距离
                        bottom: '3%',
                        containLabel: true //区域是否包含坐标轴的刻度标签
                    },
                    xAxis: [
                        {
                            type: 'category', //坐标轴类型 default: 'category'  类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
                            // value : 数值轴，适用于连续数据。  time  时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
                            // log  对数轴。适用于对数数据。
                            boundaryGap: true, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                            data: that.xData, //数据
                            axisTick: { //坐标轴刻度相关设置。
                                alignWithLabel: true //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐。
                            }
                        }
                    ],
                    yAxis: [ //y轴
                        {
                            type: 'value' //数值轴，适用于连续数据
                        }
                    ],
                    series: [
                        {
                            name: '数据:', //提示文本
                            type: 'line', //非常关键的属性:  决定了是哪个类别的图形 line 折线图 bar 柱状图  pie饼状图  scatter气泡(散点)图
                            label: {
                                show: true  //在图形上是否显示数据
                            },
                            barWidth: '60%',
                            data: that.yData
                        }
                    ],
                    animation: true //是否开启动画
                }, true);
            }

        },
        created() {
            findClasses().then(res=>this.classesArray = res.data.data);
        }
    }
</script>

<style scoped>

</style>