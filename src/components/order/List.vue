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
        <el-table-column label="明细" type="expand" width="90px">
          <template slot-scope="scope">
            <el-table :data="scope.row.goodsDetail" border stripe>
              <el-table-column label="封面" width="100px" header-align="center" align="center">
                <template slot-scope="sc">
                  <el-popover placement="top-start" trigger="hover">
                    <img :src="sc.row.url" style="width: 150px; height: 150px" />
                    <img :src="sc.row.url" slot="reference" style="width: 50px; height: 50px" />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="goods_name"></el-table-column>
              <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
              <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
              <el-table-column label="总价（元）" prop="goods_total_price" width="100px"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="90px" align="center"></el-table-column>
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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看物流信心" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-location" size="mini" @click="showProgress(scope.row.order_id)"></el-button>
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
      <el-dialog title="修改收货地址" :visible.sync="showDialog" width="50%" @close="closeDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="area">
            <el-cascader v-model="ruleForm.area" :options="cityData"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="editAddress">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="物流进度" :visible.sync="showProgressDialog" width="50%">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
            {{ item.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata';
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
      showDialog: false,
      ruleForm: {
        area: [],
        address: '',
      },
      rules: {
        area: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },
      cityData,
      orderId: '',
      showProgressDialog: false,
      progressInfo: [],
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
        item.goodsDetail = [];
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
      row.goodsDetail = res.data.goods;
      row.goodsDetail.forEach(async (item) => {
        const { data: res } = await this.$http.get(`goods/${item.goods_id}`);
        console.log('goodsDetail:', res);

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$set(item, 'goods_name', res.data.goods_name);
        this.$set(item, 'goods_weight', res.data.goods_weight);
        this.$set(item, 'url', res.data.pics[0].pics_big_url);
        console.log('row===>', row);
      });
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
    //展示修改收货地址对话框
    showEditDialog(orderId) {
      console.log('展示修改收货地址对话框');
      this.showDialog = true;
      this.orderId = orderId;
    },
    //展示物流信息
    async showProgress() {
      this.showProgressDialog = true;
      const { data: res } = await this.$http.get(`/kuaidi/123456789`);
      console.log('展示物流信息:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.progressInfo = res.data;
    },

    //修改收货地址信息
    editAddress() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`orders/${this.orderId}/address`, {
          consignee_addr: this.ruleForm.area.join(',') + this.ruleForm.address,
        });
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.showDialog = false;
        this.getOrderList();
        this.$message.success(res.meta.msg);
      });
    },
    //关闭对话框
    closeDialog() {
      console.log('清除对话框内容');
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="less">
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  padding: 20px;
}
</style>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>