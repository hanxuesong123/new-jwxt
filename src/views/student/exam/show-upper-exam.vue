<template>
    <Drawer v-model="value" :width="800" :closable="false">

        <Card style="height: 680px;background-color: #2c3e50;color: white;margin: 10px 0px 10px 0px">
            <Scroll :height="650">
                {{examData}}
            </Scroll>
        </Card>

        <Card style="height: 180px;background-color: #2c3e50;color: white;margin: 10px 0px 10px 0px">
            上传视频要求:<br>
             1.视频内容中,需有操作人姓名<br>
             2.视频格式为: xxx<br>
             3.视频时长: 3分钟以内<br>
             4.只能上传一个视频<br>
             <span style="color: red">5.上传视频成功后,即视为交卷,请谨慎操作</span><br>
            <Button type="warning" @click="submitUpload">上传视频</Button>
        </Card>

    </Drawer>
</template>

<script>
    export default {
        name: "show-upper-exam",
        data(){
            return {
                value:false,
                examData:{}
            }
        },
        methods:{
            //TODO: 查询当前上机题的内容
            getUpper(){

            },
            //TODO: 上传并交卷
            submitUpload(){

            }
        }
    }
</script>

<style scoped>

</style>