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

      <!-- <el-table :data="categoriesList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="分类名字" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
            <template slot-scope="scope">
                <i :class="[scope.row.cat_deleted ? 'el-icon-success' : 'el-icon-warning' ]"></i>
            </template>
        </el-table-column>
        <el-table-column label="排序" type="index"></el-table-column>
        <el-table-column label="操作" type="index"></el-table-column>
      </el-table> -->

      <tree-table :data="categoriesList" :columns="columns" :selection-type="false" :expand-type="false" border :show-index="true">
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-error" style="color: red"></i>
          <i v-else class="el-icon-success" style="color: lightgreen"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <template slot="operate">
          <el-button size="mini" type="primary" class="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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
      categoriesList: [], //分类列表
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, //总记录数
      //tree-table的列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //将当前列定义为模版
          template: 'isOk', //当前列使用的模版名称
        },
        {
          label: '排序',
          type: 'template', //将当前列定义为模版
          template: 'order', //当前列使用的模版名称
        },
        {
          label: '操作',
          type: 'template', //将当前列定义为模版
          template: 'operate', //当前列使用的模版名称
        },
      ],
    };
  },
  methods: {
    showDialogVisible() {},
    async getGoodsCategoriesList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      console.log('res:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.categoriesList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getGoodsCategoriesList();
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getGoodsCategoriesList();
    },
  },
};
</script>

<style>
</style>