<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="statistics" style="background: #409eff">
          <div class="title">
            <p>用户统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="num">{{ usersTotal }}</div>
          <div class="tip">当前用户数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistics" style="background: #e6a23c">
          <div class="title">
            <p>商品统计统计</p>
            <el-tag size="mini" type="info">实时</el-tag>
          </div>
          <div class="num">{{ goodsTotal }}</div>
          <div class="tip">当前总商品数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistics" style="background: #67c23a">
          <div class="title">
            <p>订单统计</p>
            <el-tag size="mini" type="warning">实时</el-tag>
          </div>
          <div class="num">{{ orderTotal }}</div>
          <div class="tip">当前总订单数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistics" style="background: #909399">
          <div class="title">
            <p>销售统计</p>
            <el-tag size="mini" type="primary">实时</el-tag>
          </div>
          <div class="num">{{ salesTotal }}</div>
          <div class="tip">当前总销售额（元）</div>
        </div>
      </el-col>
    </el-row>
    <div class="echartsBox">
      <el-card id="leftChart"></el-card>
      <el-card id="rightChart"></el-card>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  data() {
    return {
      usersTotal: 0,
      goodsTotal: 0,
      orderTotal: 0,
      orderList: [],
      salesTotal: 0,
    };
  },
  mounted() {
    this.getUserList();
    this.getGoodsList();
    this.getOrderTotal();
  },
  methods: {
    //获取用户总数
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: {
          pagenum: 1,
          pagesize: 1,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.usersTotal = res.data.total;
    },
    //获取商品总数
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: { pagenum: 1, pagesize: 1 },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsTotal = res.data.total;
    },
    //获取订单总数
    async getOrderTotal() {
      const { data: res } = await this.$http.get('orders');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.orderTotal = res.data.total;
      //计算总销售额
      this.orderList = res.data.goods;
      this.orderList.forEach((item) => {
        if (item.pay_status === '1') {
          this.salesTotal = this.salesTotal + item.order_price;
        }
      });
      this.initLeftCharts();
    },
    initLeftCharts() {
      var leftChart = echarts.init(document.getElementById('leftChart'));
      var option = {
        title: {
          text: '订单趋势',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
        },
        xAxis: {
          type: 'category',
          data: [], // ['03.20', '03.21'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            smooth: true,
            data: [], // [260, 406]
          },
        ],
      };
      leftChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  padding: 0 9px;
  .statistics {
    color: white;
    height: 100px;
    border-radius: 4px;
    padding: 0 8px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 13px;
        font-weight: bold;
      }
    }
    .num {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
    .tip {
      font-size: 12px;
    }
  }
}
.echartsBox {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .el-card {
    height: 400px;
    width: 50%;
    margin: 0 8px;
    padding: 20px;
  }
}
</style>