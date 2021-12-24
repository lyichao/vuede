<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input clearable @clear="getOrderList" placeholder="请输入订单编号" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe @expand-change="getOrderDetail">
        <el-table-column label="明细" type="expand">
          <template>
              <el-table :data="orderGoodsDetailList" border stripe>
                <el-table-column label="封面">
                  
                </el-table-column>
                <el-table-column label="商品名称"></el-table-column>
                <el-table-column label="商品重量"></el-table-column>
                <el-table-column label="商品价格（元）"></el-table-column>
                <el-table-column label="总价（元）"></el-table-column>
              </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.pay_status === '0' ? 'danger' : 'success'" effect="dark">
              {{ scope.row.pay_status === '0' ? '未付款' : '已付款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改收货地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="jumpToEdit(scope.row.order_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看物流信心" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-location" size="mini" @click="showDeleteDialog(scope.row.order_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
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
  mounted() {
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      orderGoodsDetailList:[]
    };
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
      console.log('获取订单列表:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.goods.forEach((item) => {
        // item.pay_status = item.pay_status === '0' ? '未付款' : '已付款';
        item.create_time = this.$utils.formatToTime(item.create_time);
      });
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    //获取订单明细
    async getOrderDetail(row) {
      console.log('row', row);
      const { data: res } = await this.$http.get(`orders/${row.order_id}`);
      console.log('获取订单明细:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.orderGoodsDetailList = res.data.goods
    },
    //pagesize改变时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    //pagenum改变时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    //编辑订单
    jumpToEdit() {},
    //展示物流信息
    showDeleteDialog() {},
  },
};
</script>

<style lang="less" scoped>
</style>