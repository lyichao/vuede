<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center> </el-alert>
      <el-steps :active="parseInt(activeIndex)" finish-status="success" align-center :space="200">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addRuleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addRuleForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addRuleForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="addRuleForm.goods_cat" :options="cateList" :props="cascaderProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(value, index) in item.attr_vals" :key="index" :label="value"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadUrl" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addRuleForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        imgs: [],
        goods_introduce: '',
        attrs: [],
      },
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
      cateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
      },
      manyData: [],
      onlyData: [],
      uploadUrl: 'http://www.tangxiaoyang.vip:8888/api/v2/upload',
      headersObj: {
        Authorization: JSON.parse(sessionStorage.getItem('userInfo')).token,
      },
      previewVisible: false,
      previewPath: '',
    };
  },
  computed: {
    cateId() {
      return this.addRuleForm.goods_cat.length === 3 ? this.addRuleForm.goods_cat[2] : null;
    },
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    //获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      console.log('获取商品分类:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data;
    },
    //监听级联选择器的回调事件
    handleChange() {
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.addRuleForm.goods_cat = [];
      }
    },
    //监听标签页切换之前
    beforeTabLeave(activeName, oldActivityName) {
      console.log('activeName,oldActivityName:', activeName, oldActivityName);
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类');
        return false;
      }
    },
    //切换标签页
    tabClick() {
      if (this.activeIndex === '1') {
        this.getParamsData(this.cateId, 'many');
      } else if (this.activeIndex === '2') {
        this.getParamsData(this.cateId, 'only');
      }
    },
    //获取分类参数数据
    async getParamsData(cateId, type) {
      const { data: res } = await this.$http.get(`categories/${cateId}/attributes`, { params: { sel: type } });
      console.log('getParamsData:', res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      if (type === 'many') {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        });
        this.manyData = res.data;
      } else if (type === 'only') {
        this.onlyData = res.data;
      }
    },
    //图片预览
    handlePreview(file) {
      this.previewVisible = true;
      this.previewPath = file.url;
    },
    //删除图片
    handleRemove(file) {
      console.log('handleRemove:', file);
      const filePath = file.response.data.tmp_path;
      const index = this.addRuleForm.imgs.findIndex((item) => {
        item.pic === filePath;
      });
      this.addRuleForm.imgs.splice(index, 1);
      console.log('this.addRuleForm:', this.addRuleForm);
    },
    //监听图片上传成功
    handleSuccess(res) {
      this.addRuleForm.imgs.push({
        pic: res.data.tmp_path,
      });
      console.log('this.addRuleForm:', this.addRuleForm);
    },
    //添加商品
    addGoods(){
      this.$refs.addRuleForm.validate((valid)=>{
        if(!valid){
          return 
        }
        // const {data:res} = this.$http.post('')
      })

    }
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin-right: 10px;
}
.previewImg {
  width: 100%;
}
.addBtn{
  margin-top: 15px;
}
</style>