<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三季分类设置相关参数！" type="warning" show-icon :closable="false"> </el-alert>
      <el-row class="selectBox">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKeys" :options="categoriesList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategoriesList();
  },
  data() {
    return {
      categoriesList: [],
      cascaderProps:{
          label:'cat_name',
          value:'cat_id',
          children:'children',
          expandTrigger:'hover'
      },
      selectedKeys:[]
    };
  },
  methods: {
    //获取商品分类数据列表
    async getCategoriesList() {
      const { data: res } = await this.$http.get('categories');
      console.log('res:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.categoriesList = res.data;
    },
    //级联选择器改变时
    handleChange(){

    }
  },
};
</script>

<style lang="less" scoped>
.selectBox{
    margin: 15px 0;

}
</style>