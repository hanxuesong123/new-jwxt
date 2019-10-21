<template>
    <Modal v-model="value">
        <Card v-if="data.questionType == '1'" :bordered="false" :dis-hover="true">
            <template slot="title">
                <strong>{{data.content}}</strong>
            </template>

            <RadioGroup v-model="studentAnswer" :vertical="true" style="margin-top: 10px">
                <Radio label="1" :disabled="disabledValue">A: {{data.singleOptionA}}</Radio>
                <Radio label="2" :disabled="disabledValue">B: {{data.singleOptionB}}</Radio>
                <Radio label="3" :disabled="disabledValue">C: {{data.singleOptionC}}</Radio>
                <Radio label="4" :disabled="disabledValue">D: {{data.singleOptionD}}</Radio>
            </RadioGroup> <br>

            <Tag color="warning" style="margin-top: 10px">你的答案:   {{data.studentAnswer == 1 ? 'A' : (data.studentAnswer == 2 ? "B" : (data.studentAnswer == 3 ? "C" : "D"))}}   </Tag><br>
            <Tag color="success">正确答案:   {{data.singleAsk == 1 ? 'A' : (data.singleAsk == 2 ? "B" : (data.singleAsk == 3 ? "C" : "D"))}}</Tag>
        </Card>
        <Card v-if="data.questionType == '2'" :bordered="false" :dis-hover="true">
            <template slot="title">
                <strong>{{data.content}}</strong>
            </template>
            <CheckboxGroup  v-model="mutipleAsk"  style="margin-top: 10px">
                <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="1">A: {{data.mutipleOptionA}}</Checkbox><br>
                <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="2">B: {{data.mutipleOptionB}}</Checkbox><br>
                <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="3">C: {{data.mutipleOptionC}}</Checkbox><br>
                <Checkbox :disabled="disabledValue" style="margin-bottom: 10px" label="4">D: {{data.mutipleOptionD}}</Checkbox>
            </CheckboxGroup>
            <Tag color="warning" style="margin-top: 10px">你的答案:  {{formart_mutipleAsk(data.studentAnswer)}}</Tag><br>
            <Tag color="success" >正确答案:  {{formart_mutipleAsk(data.mutipleAsk)}}</Tag>
        </Card>
        <Card v-if="data.questionType == '3'" :bordered="false" :dis-hover="true">
            <strong>{{data.content}}</strong>
        </Card>
        <Card v-if="data.qustionType == '4'" :bordered="false" :dis-hover="true">
            <template slot="title">
                <strong>{{data.content}}</strong>
            </template>
            <button :disabled="true" type="primary">下载资源</button>
        </Card>

        <template slot="footer">
            <Button type="warning" @click="handleRemove">解除错题</Button>
        </template>
    </Modal>
</template>

<script>

    import { removeErrorQuestion } from "@/api/student/exercise";

    export default {
        name: "exercise-error-info",
        data(){
            return {
                data:{},
                value : false,
                disabledValue:true,
                studentAnswer:'',
                mutipleAsk:[]
            }
        },
        methods:{
            handleRemove(){
                //alert(this.data.id);
                this.$Modal.confirm({
                    title:'友情提示',
                    content:'确定要删除吗？',
                    onOk:()=>{
                       removeErrorQuestion(this.data.id).then(res=>{
                           if(res.data.code == 10000){
                               this.$Message.success("删除成功");
                           }else{
                               this.$Message.error(this.data.message);
                           }
                           this.value = false;
                           this.$parent.list(this.$parent.params);
                       });
                    }
                });
            },
            formart_mutipleAsk(data){ //处理多选题答案的工具方法
                let array = [];
                if(data.includes("1")){ //1,3 A,C
                    array.push("A");
                }
                if(data.includes("2")){
                    array.push("B");
                }
                if(data.includes("3")){
                    array.push("C");
                }
                if(data.includes("4")){
                    array.push("D");
                }

                return array.join(",");

            }
        }
    }
</script>

<style scoped>

</style>