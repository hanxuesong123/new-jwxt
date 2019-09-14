<template>
  <div>
    <Drawer v-model="value" :closable="false" :width="400" title="角色信息">
      <Form ref="form" :model="roleObject" :rules="rules" :label-width="80">
        <FormItem prop="name" label="角色名称">
          <Input v-model="roleObject.name" placeholder="请输入角色名称"/>
        </FormItem>
        <FormItem prop="description" label="角色描述">
          <Input v-model="roleObject.description" placeholder="请输入角色描述"/>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="primary" icon="md-add" @click="handleSubmit('form')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

  import { saveOrUpdate } from '@/api/permission/role';

  export default {
    name: 'add-edit-role',
    data(){
      return {
        value :false,
        roleObject:{}
      }
    },
    computed:{
      rules(){

      }
    },
    methods:{
      handleSubmit(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            saveOrUpdate(this.roleObject).then(res=>{
              if(res.data.code == 10000){
                this.$Message.success(res.data.message);
              }else{
                this.$Message.error(res.data.message);
              }
              this.value = false;
              this.$parent.getRoleList(this.$parent.params);
            })
          }else{
            return false;
          }
        });
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
