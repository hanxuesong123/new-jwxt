<template>
  <div>
    <div :style="{display:askStyle}">
      <FormItem  prop="askContent" label="题干" style="width: 600px">
        <Input type="textarea" placeholder="请输入问答题题干" v-model="askObject.askContent"  />
      </FormItem>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-edit-ask',
    props:['parent'],
    data(){
      let that  = this;
      return {
        askStyle: 'none',
        askObject: {}
      }
    }
  };
</script>

<style scoped>

</style>
