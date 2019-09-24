<template>
  <div>
    <Drawer v-model="value" :closable="false" width="600px">

      <Card style="height: 50px;background-color: #2d8cf0;color: white;margin: 20px 0px 20px 0px" :bordered="false" :dis-hover="true">字典信息</Card>

      <Form ref="form" :model="generalObject" :rules="rules" :label-width="80">
        <FormItem prop="name" label="字典名称">
          <Input type="text" placeholder="请输入字典名称" v-model="generalObject.name" />
        </FormItem>
        <FormItem prop="code" label="字典代码">
          <Input type="text" placeholder="请输入字典代码" v-model="generalObject.code" />
        </FormItem>
        <FormItem prop="code" label="代码描述">
          <Input type="text" placeholder="请输入代码描述" v-model="generalObject.description" />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="primary" icon="md-add" @click="handleSubmit('form')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

  import { saveOrUpdate } from '@/api/other/general';

  export default {
    name: 'add-edit-general',
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
      },
    },
    data(){
      return {
        value : false,
        generalObject:{}
      }
    },
    methods:{
      handleSubmit(name){
        this.$refs[name].validate(valid=>{
          if(valid){
            saveOrUpdate(this.generalObject).then(res=>{
              if(res.data.code === 10000){
                this.$Message.success(res.data.message);
              }else{
                this.$Message.error(res.data.message);
              }
              this.value = false;
              this.$parent.getGeneralList(this.$parent.params);
            });
          }else{
            return false;
          }
        });
      }
    },
    computed:{
      rules(){
        return {
          name:this.nameRules,
          code:this.codeRules,
          description:this.descriptionRules
        }
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
