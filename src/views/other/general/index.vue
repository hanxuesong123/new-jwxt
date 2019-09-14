<template>
  <div>
    <self-table :params="params" :list="getGeneralList" :loading="loading" :data="generalArray" :columns="columns"></self-table>
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
    computed:{
      columns(){

      }
    },
    methods:{
      getGeneralList(data){

      }
    }
  };
</script>

<style scoped>

</style>
