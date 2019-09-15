<template>
    <div :style="{display:upperStyle}">
      <FormItem prop="upperContent" label="题干" style="width: 600px">
        <i-editor v-model="upperObject.upperContent"></i-editor>
      </FormItem>
      <FormItem prop="" label="上传素材">
        <Upload ref="upload"
                name="file"
                :max-size="1000 * 1024 * 500"
                :format="['zip']"
                action="http://localhost:56710/upload/uploadUpperFile"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-format-error="formatError"
                :on-exceeded-size="exceededSize">
          <Button ref="btn" type="success" :disabled="btnDisabled">上传</Button>
        </Upload>
      </FormItem>
    </div>
</template>

<script>

  import { saveOrUpdate } from '@/api/academic/questions';

  export default {
    name: 'add-edit-upper',
    props:["requestParams",'parent'],
    data(){
      return {
        upperStyle:'none',
        upperObject:{},
        btnDisabled:false
      };
    },
    watch:{
      'upperObject.id'(value){
        if(value){
          this.btnDisabled = true;
        }
      }
    },
    methods:{
      beforeUpload(file){
        this.upperObject.file = file;
        return false;
      },
      formatError(){
        this.$Message.error("只能上传ZIP格式的文件");
      },
      exceededSize(){
        this.$Message.error("只能上传小于500MB的文件");
      },
      uploadSuccess(response,file,fileList){
        //获得父组件的requestParams 把id赋值给他
        if(this.requestParams){
          this.requestParams.id = response.data.id;
          saveOrUpdate(this.requestParams).then(res=>{
            res.data.code == 10000 ? this.$Message.success(res.data.message) : this.$Message.error(res.data.message);
            this.$refs['upload'].clearFiles();
            this.parent.value = false;
            this.parent.$parent.getQuestionList(this.parent.$parent.params);
          })
        }
      },
      uploadError(){
        return Promise.reject("上传失败");
      }
    }
  };
</script>

<style scoped>

</style>
