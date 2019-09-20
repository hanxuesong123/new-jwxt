<template>
    <Modal :fullscreen="true" v-model="value" :footer-hide="true" :closable="true" >
        <charts :xData="xData" :yData="yData" :title="'成绩分析'" :subTitle="subTitle"></charts>
    </Modal>
</template>

<script>
    export default {
        name: "analysis-exam",

        data(){
            return {
                value : false,
                examObject : {},
                yData: [120, 500, 150, 80, 70, 110, 130],
                xData:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            }
        },
        watch:{
          value(data){
              if(data){
                  console.log(this.examObject);
              }
          }
        },
        computed:{
            subTitle(){
                return this.examObject.examType == '1' ? '日测' : ( this.examObject.examType == '2' ? '周测' : '月考' )
            }
        }
    }
</script>

<style scoped>

</style>