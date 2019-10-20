<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <Row :gutter="20" style="margin:20px">
                <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in data" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
                    <info-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" @click.native="handlerClick(infor.id)">
                        <strong style="font-size: 30px;color:palevioletred">{{infor.count}}</strong>道题
                        <p>{{ infor.title }}</p>
                    </info-card>
                </i-col>
            </Row>
        </Card>
        <Card  :bordered="false" :dis-hover="true">
            <img src="../../../assets/image/xuexi2.png" width="100%" height="55%"><br>
        </Card>
        <exercise-question ref="exerciseQuestion"></exercise-question>
    </div>
</template>

<script>


    import { getStages } from "@/api/student/exercise";

    export default {
        name: "exercise-index",
        components:{
            ExerciseQuestion:()=>import("@/views/student/exam/exercise-question.vue")
        },
        data(){
            return{
                data:[]
            }
        },
        methods:{
            handlerClick(id,name){
                this.$refs['exerciseQuestion'].stageId = id;
                this.$refs['exerciseQuestion'].value = true;
            }
        },
        created() {
            getStages().then(res=>{
                if(res.data.code == 10000){
                    this.data = res.data.data;
                }
            });
        }
    }
</script>

<style scoped>

</style>