<template>
  <div class="login">
      <Card  style="background:rgba(255,255,255,0.5);" class="card" icon="log-in" title="欢迎登陆" :bordered="false">
        <template slot="title">
          <center>
            <img src="../../assets/image/logo.png" width="200px" height="50px"><br>
            <h4 style="margin-top: 15px">石家庄北大青鸟互联网教育集团欢迎您</h4>
          </center>
        </template>

        <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit('loginForm')">
          <FormItem prop="username">
            <Input style="opacity: 1" v-model="form.username" placeholder="请输入用户名" >
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
            this.handleLogin(this.form).then(res=>{  //如果执行成功则设置token(store/user.js)
              this.getUserInfo().then(res=>{  //如果查询用户信息成功 则设置access(store/user.js)
                this.$router.push({ //开始路由跳转到首页
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
  .login-title{

  }

  .login{
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/image/bg-new.jpg");
    padding: 10px 10px 10px 10px;
    background-size: cover;
    background-position: center;
  }
  .card{
    padding: 10px 0px 0px;
    /*margin: 300px 0px 0px 1300px;*/
    position: absolute;
    top: 30%;
    right: 10%;
    width:430px;
    height:350px;
  }



</style>
