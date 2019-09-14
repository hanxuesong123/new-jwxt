<template>
  <div>
    <self-table :params="params" :list="" :loading="" :data="" :columns=""></self-table>
  </div>
</template>

<script>
  export default {
    name: 'general',
    data(){
      return {
        loading:true,
        params:{page:1,size:10,total:0},
        generalArray:[]
      }
    },
    methods:{}
  };
</script>

<style scoped>

</style>
