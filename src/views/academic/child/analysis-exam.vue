<template>
    <Modal :fullscreen="true" v-model="value" :footer-hide="true" :closable="true" >
        <!--<charts :xData="xData" :yData="yData" :title="'成绩分析'" :subTitle="subTitle" :parent="this"></charts>-->

        <Card :dis-hover="true" :bordered="false">
            <template slot="title">
                <span style="font-size: 20px;font-family: 'Arial Black'">成绩分析图</span>
            </template>
            <div id="myChart" :style="{width: '1400px', height: '400px',marginLeft:'200px'}"></div>
        </Card>

        <Card :dis-hover="true" :bordered="false">
            <template slot="title">
                <span style="font-size: 20px;font-family: 'Arial Black'">学员排行图</span>
            </template>

            <Table :data="scoreArray" :columns="columns" :border="true" style="margin: 0px 300px 0px 250px">
                <template slot="header">
                    <div style="text-align: center">
                        <span style="margin-right: 100px">优秀占比:{{good}}%</span>
                        <span style="margin-right: 100px">合格占比:{{hg}}%</span>
                        <span style="margin-right: 100px">不合格占比:{{bhg}}%</span>
                        <span style="margin-right: 100px">未参考占比:{{no}}%</span>
                    </div>
                </template>
            </Table>
        </Card>

        <Card :bordered="false" :dis-hover="true" v-if="examObject.singleCount > 0">
            <template slot="title">
                <span style="font-size: 20px;font-family: 'Arial Black'">单选题对错分析图</span>
            </template>
            <Table :data="singleBankData" :columns="singleBankColumns" :border="true" style="margin: 0px 300px 0px 250px"></Table>
        </Card>

        <Card :bordered="false" :dis-hover="true" v-if="examObject.mutipleCount > 0">
            <template slot="title">
                <span style="font-size: 20px;font-family: 'Arial Black'">多选题对错分析图</span>
            </template>
            <Table :data="mutipleBankData" :columns="mutipleBankColumns" :border="true" style="margin: 0px 300px 0px 250px"></Table>
        </Card>

    </Modal>
</template>

<script>

    import { analysisExam } from "@/api/academic/exam";

    export default {
        name: "analysis-exam",
        data(){
            return {
                value : false,
                examObject : {},
                params:{page:1,size:30,total:0},
                yData: [],// [120, 500, 150, 80, 70, 110, 130],
                xData:[],//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                scoreArray:[]
            }
        },
        computed:{
            singleBankData(){
                let arr = [];
                //思路:
                // 1.拿到试卷单选题的每一个单选题id
                // 2.拿到每个学员单选题答题情况
                // 3.判断,每个学员单选题答题情况是否包含单选题id,如果包含,则+1
                this.examObject.singleJoins.split(",").forEach((exam_single_id,index)=>{//拿到试卷单选题的每一个单选题id
                    let ele = { title:"",ok:0,no:0 };
                    ele.title = "第"+ ( index + 1 ) +"题";
                    let person_number = this.scoreArray.length;
                    this.scoreArray.forEach(score=>{//拿到每个学员单选题答题情况
                       if(score.singleSuccIds.includes(exam_single_id)){
                           ele.ok += 1;
                       }
                   });
                    ele.no = ((person_number - ele.ok) / person_number) * 100;
                    ele.ok = ( ele.ok / person_number) * 100 ;
                    arr.push(ele);
                });

                return arr;
            },
            singleBankColumns(){
              return [
                  {key:'title',title:'第几题',align:'center'},
                  {key:'ok',title:'对题占比',align:'center',render(h,params){
                    return h('span',{},params.row.ok + "%");
                  }},
                  {key:'no',title:'错题占比',align:'center',render(h,params){
                          return h('span',{},params.row.no + "%");
                      }}
              ];
            },
            mutipleBankData(){
                let arr = [];
                //思路:
                // 1.拿到试卷单选题的每一个单选题id
                // 2.拿到每个学员单选题答题情况
                // 3.判断,每个学员单选题答题情况是否包含单选题id,如果包含,则+1
                this.examObject.mutipleJoins.split(",").forEach((exam_mutiple_id,index)=>{//拿到试卷单选题的每一个单选题id
                    let ele = { title:"",ok:0 ,no:0 };
                    ele.title = "第"+ ( index + 1 ) +"题";
                    let person_number = this.scoreArray.length;
                    this.scoreArray.forEach(score=>{//拿到每个学员单选题答题情况
                        if(score.multipleSuccIds.includes(exam_mutiple_id)){
                            ele.ok += 1;
                        }
                    });
                    ele.no = ((person_number - ele.ok) / person_number) * 100;
                    ele.ok = ( ele.ok / person_number) * 100;
                    arr.push(ele);
                });

                return arr;
            },
            mutipleBankColumns(){
                return [
                    {key:'title',title:'第几题',align:'center'},
                    {key:'ok',title:'对题占比',align:'center',render(h,params){
                            return h('span',{},params.row.ok + "%");
                        }},
                    {key:'no',title:'错题占比',align:'center',render(h,params){
                            return h('span',{},params.row.no + "%");
                        }}
                ];
            },
            good(){  //优秀
                let count =  this.scoreArray.filter(item=>{
                    return item.score >= 90
                }).length;

                return Math.floor((count / this.scoreArray.length) * 100);
            },
            hg(){  //合格
                let count =  this.scoreArray.filter(item=>{
                    return (item.score < 90 && item.score >= 60)
                }).length;

                return Math.floor((count / this.scoreArray.length) * 100);
            },
            bhg(){ //不合格
                let count =  this.scoreArray.filter(item=>{
                    return item.score < 60
                }).length;

                return Math.floor((count / this.scoreArray.length) * 100);
            },
            no(){ //未参考
                let count =  this.scoreArray.filter(item=>{
                    return item.status == '0'
                }).length;

                return Math.floor((count / this.scoreArray.length) * 100);
            },
            subTitle(){
                return this.examObject.examType == '1' ? '日测' : ( this.examObject.examType == '2' ? '周测' : '月考' )
            },
            columns(){
                return [
                    {key:'nickName',title:'姓名',align:'center'},
                    {key:'score',title:'成绩',align:'center'},
                    {key:'sort',title:'排名',align:'center'},
                    {key:'status',title:'状态',align:'center',render(h,params){
                        return h('span',{style:{color:params.row.status == '0' ? 'red':''}},params.row.status == '0' ? '未考':'已考');
                    }}
                ]
            }
        },
        methods:{
            init() {
                let that = this;
                let myChart = this.$echarts.init(document.getElementById('myChart'));  //实例化echarts容器
                // 绘制图表
                myChart.setOption({
                    title: { //标题项
                        show: true, //是否显示标题
                        text: '123213', //主标题
                        subtext: that.subTitle, //副标题
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
        watch:{
            value(data){
                if(data){
                    this.yData = [];
                    this.xData = [];
                    analysisExam(this.examObject).then(res=>{
                        this.scoreArray = res.data.data;
                    });
                }
            },
            scoreArray(data){
                if(data && data.length > 0){
                    data.forEach(item=>{
                        this.xData.push(item.nickName);
                        this.yData.push(parseInt(item.score));
                    })
                }
                this.init();
            }
        }
    }
</script>

<style scoped>

</style>