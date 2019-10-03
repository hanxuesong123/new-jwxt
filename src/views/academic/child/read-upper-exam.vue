<template>
    <div>
        <Drawer v-model="value" :width="800">
            <Card :bordered="false" :dis-hover="true">

            </Card>
            <Card :bordered="false" :dis-hover="true">
                <Table :data="computed_table_data" :columns="columns" :border="true" :loading="loading">

                </Table>
            </Card>
        </Drawer>
    </div>
</template>

<script>

    import { readStudentUppers } from "@/api/academic/exam";

    export default {
        name: "read-upper-exam",
        data(){
            return {
                value : false,
                examData:{},
                data:[],
                loading:true
            }
        },
        watch:{
            value(data){
                if(data){
                    readStudentUppers(this.examData).then(res=>this.data = res.data.data);
                }
            },
            data(data){
                if(data && data.length > -1){
                    this.loading = false;
                }
            }
        },
        computed:{
            columns(){
                return [

                ];
            },
            computed_table_data(){

            }
        }
    }
</script>

<style scoped>

</style>