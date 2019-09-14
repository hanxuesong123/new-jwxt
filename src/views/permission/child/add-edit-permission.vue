<template>
  <div>
    <Drawer v-model="value" title="权限信息" width="600px" :closable="false">
      <Form ref="form" :model="permissionData" :rules="rules" :label-width="80">
        <FormItem prop="name" label="权限名称">
          <Input type="text" placeholder="请输入权限名称" v-model="permissionData.name"/>
        </FormItem>
        <FormItem prop="code" label="权限编码">
          <Input type="text" placeholder="请输入权限编码" v-model="permissionData.code"/>
        </FormItem>
        <FormItem prop="description" label="权限描述">
          <Input type="text" placeholder="请输入权限描述" v-model="permissionData.description"/>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button icon="md-add" type="primary" @click="handleSubmit('form')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

  import { saveOrUpdate } from '@/api/permission/permission';

  export default {
    name: 'add-edit-permission',
    props:{
      nameRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:'blur'}
          ]
        }
      },
      codeRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:'blur'}
          ]
        }
      },
      descriptionRules:{
        type:Array,
        default:()=>{
          return [
            {required:true,message:'必填项',trigger:'blur'}
          ]
        }
      }
    },
    data(){
      return{
        value:false,
        permissionData:{}
      }
    },
    computed:{
      rules(){
        return {
          name:this.nameRules,
          description:this.descriptionRules,
          code:this.codeRules
        }
      }
    },
    methods:{
      handleSubmit(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            saveOrUpdate(this.permissionData).then(res=>{
              if (res.data.code == 10000) {
                this.$Message.success(res.data.message);
              } else {
                this.$Message.error(res.data.message);
              }
              this.value = false;
              this.$parent.getPermissionList({page:1,size:5,type:1,pid:0});
            })
          }else{
            return false;
          }
        })
      }
    }
  };
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
