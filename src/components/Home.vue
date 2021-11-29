<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="../assets//imgs/shop.png" />
        <span>电商后台管理系统</span>
      </div>
      <div class="right">
        <span>欢迎您：{{ userInfo.username }}</span>
        <el-button type="danger" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  },
  methods: {
    logout() {
      this.$confirm("确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            sessionStorage.clear()
            this.$router.push('./login')
        })
        .catch(() => {
            
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: url("../assets/imgs/header_bg.gif") repeat-x center;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  .left {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      margin-right: 20px;
    }
    span {
      font-size: 20px;
    }
  }
  .right {
    span {
      margin-right: 10px;
    }
  }
}
</style>