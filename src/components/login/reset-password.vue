<template>
    <div>
        <Modal v-model="value" :closable="false" title="用户修改密码窗口" >
            <Form ref="form" :model="user" :label-width="80" :rules="rules">
                <FormItem prop="oldPassword"   label="原始密码">
                    <Input v-model="user.oldPassword" placeholder="请输入原始密码" />
                </FormItem>

                <FormItem prop="newPassword" label="新密码">
                    <Input v-model="user.newPassword" placeholder="请输入新密码" />
                </FormItem>

                <FormItem prop="againPassword" label="确认密码">
                    <Input v-model="user.againPassword" placeholder="请再次输入新密码" />
                </FormItem>
            </Form>

            <template slot="footer">
                <Button type="primary" @click="handleSubmit('form')">提交</Button>
            </template>

        </Modal>
    </div>
</template>

<script>
    import { isPassword } from "@/utils/validate/commons/commons_validate";
    import { updatePassword } from "@/api/permission/user";
    import { mapActions } from 'vuex'
    import { setToken } from "@/utils/tools";
    import { logout } from "@/api/other/login";

    export default {
        name: "reset-password",
        data(){
            return {
                value : false,
                user: {}
            }
        },
        computed:{
            rules(){
                return {
                    oldPassword:[
                        {validator:isPassword,trigger:'blur'}
                    ],
                    newPassword:[
                        {validator:isPassword,trigger:'blur'}
                    ],
                    againPassword:[
                        {validator:isPassword,trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            ...mapActions([
                'logout'
            ]),
            handleSubmit(name){
                this.$refs[name].validate(valid=>{
                    if(valid){
                        if(this.user.newPassword != this.user.againPassword){
                            this.$Message.error("两次密码不一致,请重新输入");
                            return false;
                        }

                        updatePassword(this.user).then(res=>{
                            if(res.data.code == 10000){
                                this.value = false;
                                logout().then(response=>{
                                    setToken("");
                                    this.logout();
                                    this.$router.push({name:'login'});
                                    this.$Message.success(res.data.message);
                                });
                            }else if(res.data.code == 9998){
                                this.$Message.error(res.data.message);
                            }else{
                                this.$Message.error(res.data.message);
                                this.value = false;
                            }
                        });
                    }else{
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>