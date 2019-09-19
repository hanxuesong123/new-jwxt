<template>
    <div>
        <Drawer v-model="value" :width="800" :closable="false">

            <center>
                <img src="../../../assets/image/logo.png"  width="500px" height="300px"><br>

                <span style="margin: 10px 0px 10px 0px">当前班级: {{studentObject.classesName}}</span>
            </center>




            <Form  ref="form" :model="data" :label-width="80" :rules="rules">
                <FormItem prop="classesId" label="班级名称">
                    <Select v-model="data.classesId">
                        <Option :value="item.id" :key="item.id" v-for="item in classesArray">{{item.className}}</Option>
                    </Select>
                </FormItem>
            </Form>

            <div class="demo-drawer-footer">
                <Button type="primary" @click="handleSubmit('form')" icon="md-add" style="margin-right: 5px">关联</Button>
            </div>

        </Drawer>
    </div>
</template>

<script>

    import { findClasses } from "@/api/quality/classes";
    import { accessClasses } from "@/api/quality/student";

    export default {
        name: "access-classes",
        props:{
            classesIdRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            }
        },
        data(){
            return {
                value : false,
                studentObject:{},
                classesArray:[],
                data:{}
            }
        },
        methods:{
            handleSubmit(name){
                this.$refs[name].validate(valid=>{
                    if(valid){
                        this.data.studentId = this.studentObject.id;
                        accessClasses(this.data).then(res=>{
                            this.$Message.info(res.data.message);
                            this.value = false;
                            this.$parent.getStudentList(this.$parent.params);
                        })
                    }else{
                        return false;
                    }
                })
            }
        },
        watch:{
            value(data){
                if(data){
                    console.log(this.studentObject)
                    findClasses().then(res=>this.classesArray = res.data.data);
                }
            }
        },
        computed:{
            rules(){
                return {
                    classesId:this.classesIdRules
                }
            }
        }
    }
</script>

<style scoped>
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>