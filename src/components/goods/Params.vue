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
          <el-button type="primary" size="mini" :disabled="btnDisabled" @click="btnClick">添加参数</el-button>
          <el-table stripe border :data="paramsData">
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <el-tag :key="index" v-for="(item, index) in scope.row.attr_vals" closable @close="handleClose(scope.row, index)">
                  {{ item }}
                </el-tag>
                <el-input
                  width="200"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="1">
          <el-button type="primary" size="mini" :disabled="btnDisabled" @click="btnClick">添加属性</el-button>
          <el-table stripe border :data="paramsData">
             <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <el-tag :key="index" v-for="(item, index) in scope.row.attr_vals" closable @close="handleClose(scope.row, index)">
                  {{ item }}
                </el-tag>
                <el-input
                  width="200"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="`添加${dialogTitle}`" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`修改${dialogTitle}`" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
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
      paramsData: [],
      dialogVisible: false,
      editDialogVisible: false,
      rules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      editRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      ruleForm: {},
      editRuleForm: {},
      attr_id: 0,
    };
  },
  computed: {
    categoriesId() {
      return this.selectedKeys.length > 0 ? this.selectedKeys[this.selectedKeys.length - 1] : null;
    },
    dialogTitle() {
      return this.activeName === '0' ? '动态参数' : '静态属性';
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
      if (this.selectedKeys.length > 0) {
        this.getParamsData();
      } else {
        this.paramsData = [];
      }
    },
    //监听标签页的点击事件
    handleClick() {
      if (this.selectedKeys.length > 0) {
        this.getParamsData();
      }
    },
    //获取分类参数数据
    async getParamsData() {
      const { data: res } = await this.$http.get(`categories/${this.categoriesId}/attributes`, { params: { sel: this.activeName === '0' ? 'many' : 'only' } });
      console.log('getParamsData:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        item.inputVisible = false;
        item.inputValue = '';
      });
      this.paramsData = res.data;
    },
    //添加按钮点击事件
    btnClick() {
      this.dialogVisible = true;
    },
    //关闭添加参数对话框
    closeDialog() {
      this.$refs.ruleForm.resetFields();
    },
    //关闭编辑参数对话框
    closeEditDialog() {
      this.$refs.editRuleForm.resetFields();
    },
    //对话框确定事件
    dialogConfirmBtn() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error(`${this.dialogTitle}不能为空`);
        }
        const { data: res } = await this.$http.post(`categories/${this.categoriesId}/attributes`, {
          attr_name: this.ruleForm.attr_name,
          attr_sel: this.activeName === '0' ? 'many' : 'only',
        });
        console.log('res:', res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.dialogVisible = false;
        this.getParamsData();
        this.$message.success(res.meta.msg);
      });
    },
    //编辑参数对话框确定事件
    editDialogConfirmBtn() {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error(`${this.dialogTitle}不能为空`);
        }
        const { data: res } = await this.$http.put(`categories/${this.categoriesId}/attributes/${this.editRuleForm.attr_id}`, {
          attr_name: this.editRuleForm.attr_name,
          attr_sel: this.activeName === '0' ? 'many' : 'only',
        });
        console.log('res:', res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.editDialogVisible = false;
        this.getParamsData();
        this.$message.success(res.meta.msg);
      });
    },
    //删除参数
    deleteParams(data) {
      console.log('data:', data);
      this.$confirm('确认删除此参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${data.cat_id}/attributes/${data.attr_id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getParamsData();
          this.$message.success(res.meta.msg);
        })
        .catch(() => {});
    },
    //编辑参数
    async editParams(data) {
      console.log('data:', data);
      const { data: res } = await this.$http.get(`categories/${data.cat_id}/attributes/${data.attr_id}`, {
        params: { attr_sel: this.activeName === '0' ? 'many' : 'only' },
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editRuleForm = res.data;
      this.editDialogVisible = true;
    },
    //删除参数标签
    handleClose(row, index) {
      row.attr_vals.splice(index, 1);
      this.updateParamsDetail(row);
    },
    //现实文本输入框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //监听输入框按下回车或失去焦点时事件
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim());
        this.updateParamsDetail(row);
      }
      row.inputVisible = false;
      row.inputValue = '';
    },
    //更新参数明细
    async updateParamsDetail(row) {
      const { data: res } = await this.$http.put(`categories/${this.categoriesId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
      });
      console.log('updateParamsDetail:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
  },
};
</script>

<style lang="less" scoped>
.selectBox {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>