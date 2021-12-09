<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="showDialogVisible = true">添加分类</el-button>
      </el-row>

      <el-table :data="categoriesList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="分类名字" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
            <template slot-scope="scope">
                <i :class="[scope.row.cat_deleted ? 'el-icon-success' : 'el-icon-warning' ]"></i>
            </template>
        </el-table-column>
        <el-table-column label="排序" type="index"></el-table-column>
        <el-table-column label="操作" type="index"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsCategoriesList();
  },
  data() {
    return {
        categoriesList:[],
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        total:0
    }
  },
  methods: {
    showDialogVisible() {},
    async getGoodsCategoriesList() {
      const { data: res } = await this.$http.get('categories',{params:this.queryInfo});
      console.log('res:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
  },
};
</script>

<style>
</style>