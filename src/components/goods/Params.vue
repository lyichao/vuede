<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"> </el-alert>
      <el-row class="selectBox">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKeys" :options="categoriesList" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="0">
          <el-button type="primary" size="mini" :disabled="btnDisabled">添加参数</el-button>
          <el-table border>
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column label="参数名称"> </el-table-column>
            <el-table-column label="操作"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="1"> </el-tab-pane>
      </el-tabs>
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
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
      },
      selectedKeys: [],
      activeName: '0',
      btnDisabled: true,
    };
  },
  computed: {
    categoriesId() {
      return this.selectedKeys.length > 0 ? this.selectedKeys[this.selectedKeys.length - 1] : null;
    },
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
    handleChange() {
      console.log('this.selectedKeys:', this.selectedKeys);
      this.btnDisabled = this.selectedKeys.length > 0 ? false : true;
      this.getParamsData();
    },
    //监听标签页的点击事件
    handleClick() {},
    //获取分类参数数据
    async getParamsData() {
      const { data: res } = await this.$http.get(`categories/${this.categoriesId}/attributes`, { params: { sel: this.activeName === '0' ? 'many' : 'only' } });
      console.log('getParamsData:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.selectBox {
  margin: 15px 0;
}
</style>