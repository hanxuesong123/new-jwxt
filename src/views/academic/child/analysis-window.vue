<template>
    <div>
        <Modal v-model="value" title="学员成绩总览" :width="1600" :footer-hide="true" :closable="false" >
           <Card :bordered="false" :dis-hover="true">
               <template slot="title">
                   <span>温馨提示: 请选择开始日期和结束日期后进行数据展示</span> &nbsp;&nbsp;&nbsp;
                   <DatePicker type="daterange" :clearable="false" :editable="false" separator="~" @on-change="dateChange" placeholder="请选择日期区间" style="width: 200px"></DatePicker>
               </template>
           </Card>
            <Card :bordered="false" :dis-hover="true">
                <div id="myChart1" :style="{width: '1500px', height: '500px'}"></div>
            </Card>
        </Modal>
    </div>
</template>

<script>

    import { findSingleStudentScores } from "@/api/academic/exam";
    import { formatTime } from "@/utils/tools";

    export default {
        name: "analysis-window",
        data(){
            return {
                value : false,
                examObject:{},
                data:{},//学生信息
                params:{studentId:'',date:'',examType:''},
                yData: [],// [120, 500, 150, 80, 70, 110, 130],
                xData:[],//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            }
        },
        watch:{
            'params.date'(data){
                if(data){
                    this.params.examType = this.examObject.examType;
                    this.params.studentId = this.data.studentId;
                    findSingleStudentScores(this.params).then(res=>{
                        if(res.data.code == 10000){
                            if(res.data.data.length > 0){
                                this.xData = [];
                                this.yData = [];
                                res.data.data.forEach(item=>{
                                    this.xData.push(formatTime(item.executeTime));
                                    this.yData.push(item.score);
                                });
                                this.init();
                            }
                        }else{
                            this.$Message.error(res.message);
                            return false;
                        }
                    });
                }
            }
        },
        methods:{
            dateChange(data){
                if(data){
                    this.params.date = data.join(",");
                }
            },
            clear(){
                let myChart = this.$echarts.init(document.getElementById('myChart1'));
                myChart.clear();
            },
            init() {
                let that = this;
                let myChart = this.$echarts.init(document.getElementById('myChart1'));  //实例化echarts容器
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
                            type: 'bar', //非常关键的属性:  决定了是哪个类别的图形 line 折线图 bar 柱状图  pie饼状图  scatter气泡(散点)图
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
        }
    }
</script>

<style scoped>

</style>