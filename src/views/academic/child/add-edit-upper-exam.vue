<template>
  <div>
    <Drawer v-model="value" width="400px" :mask="value2 == false" style="z-index: 9999;position:absolute" :closable="false" :mask-closable="false">

      <Card  :style="{border: type == '1' ? styleValue.border : styleValue.border2,backgroundColor: '#2d8cf0',margin:'200px 0px 0px 30px',width: '300px',height: '150px'}" @click.native="type='1',value2 = true">
          <h1 style="color:white;text-align: center;font-size: 80px">网络</h1>
      </Card>

      <Card :style="{border: type == '2' ? styleValue.border : styleValue.border2,backgroundColor: '#42b983',margin:'50px 0px 0px 30px',width: '300px',height: '150px'}" @click.native="type='2',value2 = true">
        <h1 style="color:white;text-align: center;font-size: 80px">软件</h1>
      </Card>

    </Drawer>

    <Drawer v-model="value2" width="1200px" :closable="false" :mask-closable="false">
        放上机的所有数据
    </Drawer>
  </div>
</template>

<script>
  export default {
    name: 'add-edit-upper-exam',
    data(){
      return {
        value:false,
        value2:false,
        type:'',
        styleValue:{
          border:'5px dashed red',
          border2:''
        },
        upperExamObject:{}
      };
    },
    methods:{

    },
    watch:{

    }
  };
</script>

<style scoped>

</style>
