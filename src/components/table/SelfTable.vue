<template>
  <div>
    <Table :data="data" :columns="columns" size="small" :border="true" :loading="loading">
      <template slot="loading">
        <h1 v-if="validate">数据正在加载中</h1>
        <h1 v-else>没有权限访问数据</h1>
      </template>
      <template slot="footer">
        <Page
            :current="params.page"
            :page-size="params.size"
            :total="params.total"
            :show-total="true"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"></Page>
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'self-table',
    props:{
      validate:{
        type:Boolean,
        default:true
      },
      data:{
        type:Array,
        default:[]
      },
      columns:{
        type:Array,
        default:[]
      },
      loading:{
        type:Boolean,
        default:true
      },
      params:{
        type:Object,
        default:{page:1,size:5,total:0}
      },
      list:{
        type:Function
      }
    },
    methods:{
      pageChange(page){
        this.params.page = page;
        this.list(this.params);
      },
      pageSizeChange(size){
        this.params.size = size;
        if(this.params.page == 1){
          this.list(this.params);
        }
      }
    }
  };
</script>

<style scoped>

</style>
