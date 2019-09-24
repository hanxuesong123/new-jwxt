<template>
    <div>
        <div :style="{display:upperStyle}">
            <FormItem prop="upperContent" label="题干" style="width: 600px">
                <Input type="textarea" placeholder="请输入上机题题干" v-model="upperObject.upperContent"  />
            </FormItem>
            <FormItem prop="" label="上传素材">
                <Upload ref="upload"
                        name="file"
                        :max-size="1000 * 1024 * 500"
                        :format="['zip']"
                        :action="url"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :on-format-error="formatError"
                        :on-exceeded-size="exceededSize">
                    <Button ref="btn" type="success" >上传</Button> <!--:disabled="true"-->
                    <!--
                        过去式:如果上传按钮被禁用的话,当我执行修改操作时,原来的思想是: 修改就禁用上传按钮
                        但是现在遇到一个问题: 我们现在的上传是同步的, 也是说 修改的时候没有任何文件可上传,所以报错

                    -->
                </Upload>
            </FormItem>
        </div>
    </div>
</template>

<script>

  import { saveOrUpdate } from '@/api/academic/questions';
  import { getToken } from '@/utils/tools';

  export default {
    name: 'add-edit-upper',
    props:["requestParams",'parent'],
    data(){
      return {
        upperStyle:'none',
        upperObject:{},
        //disabledValue:this.$access.has_permission('POINT-QUESTION-UPLOAD'),
        //btnDisabled:false,
        url:'http://localhost:56710/question/upload?token='+ getToken()
      };
    },
    /*watch:{
      'upperObject.id'(value){
        if(value){
          this.btnDisabled = true;
        }
      }
    },*/
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
          //先文件上传,得到upper对象,把upper,id进行赋值
          this.requestParams.id = response.data.id;  //response.data是一个upper对象

          //调用接口,修改upper
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
