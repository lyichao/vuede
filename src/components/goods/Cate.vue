<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </el-row>

      <tree-table class="treeTable" :data="categoriesList" :columns="columns" :selection-type="false" :expand-type="false" border :show-index="true">
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-error" style="color: red"></i>
          <i v-else class="el-icon-success" style="color: lightgreen"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" @click="deleteCategories(scope.row.cat_id)">删除</el-button>
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

    <el-dialog title="添加分类" :visible.sync="showDialogVisible" width="50%" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCategoriesList" clearable :props="caseaderProps" @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editCloseDialog">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editRuleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategories">确 定</el-button>
      </span>
    </el-dialog>
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
      parentCategoriesList: [], //父级分类列表
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
      showDialogVisible: false,
      editDialogVisible: false,
      ruleForm: {
        cat_name: '', //分类名称
        cat_pid: 0, //父级分类id
        cat_level: 0, //分类的等级
      },
      editRuleForm: {
        cat_name: '', //分类名称
        cat_pid: 0, //父级分类id
        cat_level: 0, //分类的等级
      },
      rules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      editRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      //级联选择器的配置对象
      caseaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true, //允许选择级联选择器中的任意项
      },
      //级联选择器中用户选中的数组
      selectedKeys: [],
    };
  },
  methods: {
    //获取商品分类数据列表
    async getGoodsCategoriesList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      console.log('res:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.categoriesList = res.data.result;
      this.total = res.data.total;
    },

    //获取父级分类的数据列表
    async getParentCategoriesList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
      console.log('getParentCategoriesList:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCategoriesList = res.data;
      this.getGoodsCategoriesList();
      this.$message.success(res.meta.msg);
    },

    //展示添加分类对话框
    showAddDialog() {
      this.showDialogVisible = true;
      this.getParentCategoriesList();
    },

    //监听级联选择器的改变
    handleChange() {
      console.log('selectedKeys:', this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.ruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.ruleForm.cat_level = this.selectedKeys.length;
      } else {
        this.ruleForm.cat_pid = 0;
        this.ruleForm.cat_level = 0;
      }

      // this.ruleForm.cat_pid
    },

    //监听对话框关闭事件
    closeDialog() {
      this.$refs.ruleForm.resetFields();
      this.selectedKeys = [];
      this.ruleForm.cat_pid = 0;
      this.ruleForm.cat_level = 0;
    },

    //关闭编辑对话框
    editCloseDialog() {
      this.$refs.editRuleForm.resetFields();
    },

    //添加商品分类
    addCategories() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post('categories', this.ruleForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.getGoodsCategoriesList();
        this.showDialogVisible = false;
      });
    },

    //编辑商品分类名称
    editCategories() {
      this.$refs.editRuleForm.validate(async (vaild) => {
        if (!vaild) {
          return;
        }
        const { data: res } = await this.$http.put(`categories/${this.editRuleForm.cat_id}`, { cat_name: this.editRuleForm.cat_name });
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        console.log('editCategories:', res);
        this.$message.success(res.meta.msg);
        this.getGoodsCategoriesList();
        this.editDialogVisible = false;
      });
    },

    //删除商品分类
    deleteCategories(id) {
      this.$confirm(`确认删除该商品分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          console.log('deleteCategories:',res)
          this.getGoodsCategoriesList();
          this.$message({ type: 'success', message: '删除成功!' });
        })
        .catch(() => {});
    },

    //显示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      console.log('showEditDialog:', res);
      this.editRuleForm = res.data;
      this.editDialogVisible = true;
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

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.treeTable {
  margin-top: 15px;
}
</style>