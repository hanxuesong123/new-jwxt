<template>
  <div>
    <div :style="{display:singleStyle}">
      <FormItem prop="singleContent" label="题干" style="width: 600px">
        <Input type="textarea" placeholder="请输入单选题题干" v-model="singleObject.singleContent"  />
      </FormItem>

      <FormItem prop="singleOptionA" label="选项A" style="width: 600px">
        <Input type="text" placeholder="请输入选项A的内容" v-model="singleObject.singleOptionA"/>
      </FormItem>

      <FormItem prop="singleOptionB" label="选项B" style="width: 600px">
        <Input type="text" placeholder="请输入选项B的内容" v-model="singleObject.singleOptionB"/>
      </FormItem>

      <FormItem prop="singleOptionC" label="选项C" style="width: 600px">
        <Input type="text" placeholder="请输入选项C的内容" v-model="singleObject.singleOptionC"/>
      </FormItem>

      <FormItem prop="singleOptionD" label="选项D" style="width: 600px">
        <Input type="text" placeholder="请输入选项D的内容" v-model="singleObject.singleOptionD"/>
      </FormItem>

      <FormItem prop="singleAsk" label="答案">
        <RadioGroup v-model="singleObject.singleAsk">
          <Radio label="1">A</Radio>
          <Radio label="2">B</Radio>
          <Radio label="3">C</Radio>
          <Radio label="4">D</Radio>
        </RadioGroup>
      </FormItem>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-edit-single',
    props:['parent'],
    data(){
      return {
        singleObject:{},
        singleStyle:'none'
      }
    }
  };
</script>

<style scoped>

</style>
