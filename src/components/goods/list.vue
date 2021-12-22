<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="requestInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="gotoAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column width="800" label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"> </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"> </el-table-column>
        <el-table-column label="创建时间" prop="add_time"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="jumpToEdit(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getGoodsList();
  },
  data() {
    return {
      goodsList: [],
      requestInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      deleteDialogVisible: false,
    };
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.requestInfo });
      console.log('getGoodsList=>', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.goods.forEach((item) => {
        item.add_time = this.$utils.formatToTime(item.add_time);
      });
      this.goodsList = res.data.goods;

      this.total = res.data.total;
    },
    //删除商品
    async deleteGoods(goodId) {
      const { data: res } = await this.$http.delete(`goods/${goodId}`);
    //   this.deleteDialogVisible = true;
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getGoodsList();
    },
    //展示添加商品对话框
    showDialogVisible() {},
    //pagesize改变时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.requestInfo.pagesize = val;
      this.getGoodsList();
    },
    //pagenum改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.requestInfo.pagenum = val;
      this.getGoodsList();
    },
    showDeleteDialog(data) {
      console.log('data:', data);
      this.$confirm(`此操作将删除该商品, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteGoods(data.goods_id);
        })
        .catch(() => {});
    },
    //跳转添加商品页面
    gotoAddPage(){
        this.$router.push('/goods/add')
    },
    //跳转编辑页面
    jumpToEdit(id){
       this.$router.push(`/goods/edit?id=${id}`)
    }
  },
};
</script>

<style lang="less" scoped>
</style>