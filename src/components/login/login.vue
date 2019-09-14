<template>
  <div class="login">
    <Card  class="card" icon="log-in" title="欢迎登陆" :bordered="false">
      <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit('loginForm')">
        <FormItem prop="username">
          <Input v-model="form.username" placeholder="请输入用户名" >
          <span slot="prepend">
            <Icon :size="16" type="ios-person"></Icon>
          </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password"  v-model="form.password" placeholder="请输入密码">
          <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit('loginForm')" type="primary" long>登陆</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>

  import { mapActions } from 'vuex'

  export default {
    name: 'login',
    props:{
      usernameRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:"必填项",trigger:'blur'}
          ]
        }
      },
      passwordRules:{
        type: Array,
        default:()=>{
          return [
            {required: true,message:'必填项',trigger: "blur"}
          ]
        }
      }
    },
    data(){
      return{
        form:{username:'',password:''}
      }
    },
    methods:{
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            this.handleLogin(this.form).then(res=>{
              this.getUserInfo().then(res=>{
                this.$router.push({
                  name : this.$config.homeName
                });
              })
            })
          }else{
            return false;
          }
        });
      }
    },
    computed:{
      rules(){
        return {
          username : this.usernameRules,
          password : this.passwordRules
        }
      }
    }
  };
</script>

<style scoped>
  .login{
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/image/bg01.jpg");
    padding: 10px 10px 10px 10px;
    background-size: cover;
    background-position: center;
  }
  .card{
    padding: 10px 0px 0px;
    margin: 300px 0px 0px 1300px;
    width:400px;
    height:300px;
  }
</style>
