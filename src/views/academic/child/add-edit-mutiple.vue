<template>
  <div>
    <div :style="{display:mutipleStyle}">
      <FormItem prop="mutipleContent" label="题干" style="width: 600px">
        <Input type="textarea" placeholder="请输入多选题题干" v-model="mutipleObject.mutipleContent"  />
      </FormItem>


      <FormItem prop="mutipleOptionA" label="选项A" style="width: 600px">
        <Input type="text" placeholder="请输入选项A的内容" v-model="mutipleObject.mutipleOptionA"/>
      </FormItem>

      <FormItem prop="mutipleOptionB" label="选项B" style="width: 600px">
        <Input type="text" placeholder="请输入选项B的内容" v-model="mutipleObject.mutipleOptionB"/>
      </FormItem>

      <FormItem prop="mutipleOptionC" label="选项C" style="width: 600px">
        <Input type="text" placeholder="请输入选项C的内容" v-model="mutipleObject.mutipleOptionC"/>
      </FormItem>

      <FormItem prop="mutipleOptionD" label="选项D" style="width: 600px">
        <Input type="text" placeholder="请输入选项D的内容" v-model="mutipleObject.mutipleOptionD"/>
      </FormItem>


      <FormItem prop="mutipleAsk" label="答案">
        <CheckboxGroup v-model="mutipleObject.mutipleAsk">
          <Checkbox label="1">A</Checkbox>
          <Checkbox label="2">B</Checkbox>
          <Checkbox label="3">C</Checkbox>
          <Checkbox label="4">D</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'add-edit-mutiple',
    data(){
      return {
        mutipleObject:{},
        mutipleStyle:'none'
      }
    },
    created(){
      this.mutipleStyle = "block";
    }
  };
</script>

<style scoped>

</style>
