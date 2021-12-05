<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column label="索引" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="role_name">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-setting" size="mini" @click="showPermissionDialog(scope.row)"></el-button>
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

    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editCloseDialog">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="permissionDialogVisible" width="50%" @close="permissionCloseDialog">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="permissionUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
    this.getRolesList();
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      permissionDialogVisible: false,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editRuleForm: {
        username: '',
        email: '',
        mobile: '',
      },
      userInfo: {},
      rolesList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '手机号码不正确',
            trigger: 'blur',
          },
        ],
      },
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '手机号码不正确',
            trigger: 'blur',
          },
        ],
      },
      selectRoleId: '',
    };
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log('this.userList:', this.userList);
    },
    //请求角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      console.log('getRolesList:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.rolesList = res.data;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    async userStateChange(data) {
      console.log('data=>', data);
      const { data: res } = await this.$http.put(`users/${data.id}/state/${data.mg_state}`);
      console.log('userStateChange:', res);
      if (res.meta.status !== 200) {
        data.mg_state = !data.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.getUserList();
    },
    closeDialog() {
      console.log('closeDialog');
      this.$refs.ruleForm.resetFields();
    },
    editCloseDialog() {
      this.$refs.editRuleForm.resetFields();
    },
    permissionCloseDialog() {
      this.selectRoleId = '';
      this.userInfo = [];
    },
    addUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post('users', this.ruleForm);
        console.log('res:', res);

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.dialogVisible = false;
        this.getUserList();
        this.$message.success(res.meta.msg);
      });
    },
    async editUser() {
      console.log('editUser:', this.editRuleForm);
      const { data: res } = await this.$http.put(`users/${this.editRuleForm.id}`, {
        email: this.editRuleForm.email,
        mobile: this.editRuleForm.mobile,
      });

      this.getUserList();
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.editDialogVisible = false;
    },
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      console.log('showEditDialog:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editRuleForm = res.data;
    },
    async deleteUser() {
      const { data: res } = await this.$http.delete(`users/${this.ruleForm.id}`);
      this.deleteDialogVisible = false;
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getUserList();
    },
    showDeleteDialog(data) {
      this.ruleForm = data;
      console.log('this.ruleForm:', this.ruleForm);
      this.$confirm(`此操作将删除${this.ruleForm.username}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteUser();
        })
        .catch(() => {});
    },
    showPermissionDialog(data) {
      console.log('showPermissionDialog:', data);
      this.userInfo = data;
      this.permissionDialogVisible = true;
    },
    async permissionUser() {
      console.log('permissionUser:', this.userInfo.id, this.selectRoleId);
      if (!this.selectRoleId) {
        return this.$message.error('请选择角色');
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.permissionDialogVisible = false;
      this.getUserList();
      this.$message.success(res.meta.msg);
    },
  },
};
</script>

<style lang="less" scoped>
</style>