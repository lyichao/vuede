<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-row>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-row>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="{borderBottom:true,borderTop:index1 === 0,vCenter:true}">
              <el-col :span="5" >
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
                </el-col
              >
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="{borderTop:index2!==0,vCenter:true}">
                  <el-col :span="6">
                    <el-tag type="success" closable>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" >
                    <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描叙" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warming" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      ruleForm: {
        roleName: '',
        roleDesc: '',
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.rolesList = res.data;
      console.log('this.rolesList:', this.rolesList);
    },
    addRole() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }

        const { data: res } = await this.$http.post('roles', this.ruleForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.dialogVisible = false;
        this.getRolesList();
        this.$message.success(res.meta.msg);
      });
    },
    deleteRole(data) {
      console.log('deleteRole:', data);
      this.$confirm(`确认删除${data.roleName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${data.id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getRolesList();
          this.$message({ type: 'success', message: '删除成功!' });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag{
  margin: 6px;
}
.borderTop{
  border-top: 1px solid #eeeeee;
}
.borderBottom{
  border-bottom: 1px solid #eeeeee;
}
.vCenter{
  display: flex;
  align-items: center;
}
</style>