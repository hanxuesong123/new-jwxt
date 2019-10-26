<template>
    <div>
        <Modal v-model="value" title="修改密码确认框" :closable="false" >
            <Form ref="form" :model="params" :label-width="80" :rules="rules">
                <FormItem label="手机号" prop="telephone">
                    <Input type="text" v-model="params.telephone" placeholder="请输入您的手机号" />
                </FormItem>
                <FormItem label="验证码" prop="code">
                    <Input v-model="params.code">
                        <Button :disabled="disabledValue" slot="append" type="primary" @click="sendCode">
                            <span v-if="count == 60">获取验证码</span>
                            <span v-else>获取验证码({{count}})</span>
                        </Button>
                    </Input>
                </FormItem>

                <span :style="{display: displayValue}">
                    <FormItem  prop="password" label="全新密码" error="请输入密码" :required="checkValue">
                        <Input v-model="params.password" />
                    </FormItem>

                    <FormItem prop="againPassword" label="确认密码" error="请输入密码" :required="checkValue">
                        <Input v-model="params.againPassword"/>
                    </FormItem>
                </span>
            </Form>

            <template slot="footer">
                <Button @click="handleSubmit">提交</Button>
            </template>

        </Modal>
    </div>
</template>

<script>

    import { checkTelephone,sendCode,updatePasswordByCode } from "@/api/permission/user";

    export default {
        name: "update-password",
        data(){
            return {
                value : false,
                params:{},
                count:60,
                checkValue:false,
                displayValue:'none',
                disabledValue:false,
                timer:''
            }
        },
        props:{
            telephoneRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'blur'}
                    ];
                }
            },
            codeRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'blur'}
                    ];
                }
            }
        },
        computed:{
            rules(){
                return {
                    telephone:this.telephoneRule,
                    code:this.codeRule
                }
            }
        },
        methods:{
            sendCode(){

                checkTelephone({telephone:this.params.telephone}).then(res=>{
                    if(res.data.code != 10000){
                        this.$Message.error("手机号错误或不存在");
                        return false;
                    }else{

                        sendCode({telephone:this.params.telephone}).then(res=>{
                            if(res.data.code == 10000){
                                this.$Message.success("邮件已发送到您的邮箱,5分钟内有效");
                                this.displayValue = "block";
                                this.disabledValue = true;
                                this.timer = setInterval(()=>{
                                    this.count--;
                                    if(this.count == 0){
                                        this.disabledValue = false;
                                        //this.displayValue = "none";
                                        this.count = 60;
                                        clearInterval(this.timer);
                                    }
                                },1000);
                            }
                        });
                    }
                });

            },
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                   if(valid){
                       let {code,password,againPassword } = this.params;
                       if(password != againPassword){
                           this.$Message.error("两次密码不一致,请重新输入");
                           return false;
                       }
                       updatePasswordByCode(this.params).then(res=>{
                           if(res.data.code == 10000){
                               this.$Message.success(res.data.message);
                               this.value = false;
                               if(this.timer){
                                   clearInterval(this.timer);
                               }
                           }else{
                               this.$Message.error(res.data.message);
                               return false;
                           }
                       });

                   }else{
                       return false;
                   }
                });
            }
        },
        created(){
            this.displayValue = "none";
            //this.disabledValue = true;
        }
    }
</script>

<style scoped>

</style>