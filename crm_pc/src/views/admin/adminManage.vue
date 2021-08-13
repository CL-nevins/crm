<template>
  <div class="app-container">
    <!-- 条件搜索 -->
    <div class="search-container">
      <el-form :model="adminSearch" :inline="true" ref="adminSearch" :rules="adminSearchRules">
        <el-form-item prop="user_name" label-width="224">
          <el-input
            v-model="adminSearch.user_name"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="nick_name" label-width="224">
          <el-input
            v-model="adminSearch.nick_name"
            placeholder="昵称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label-width="124">
          <el-input v-model="adminSearch.phone" placeholder="手机号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="searchDate">
          <el-date-picker
            v-model="adminSearch.searchDate"
            type="daterange"
            start-placeholder="创建开始日期"
            end-placeholder="创建结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="layout_right">
          <el-button
            type="primary"
            v-loading="listLoading"
            @click="fetchData()"
            icon="el-icon-search"
            >搜索</el-button
          >
          <el-button type="primary" icon="el-icon-edit">添加</el-button>
          <el-button type="primary" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据展示区 调试区 -->
    <!-- <p>日期值：{{ adminSearch.searchDate }} 数据总计: {{ count }}</p> -->

    <!-- 列表显示区域 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="user_name"
        label="用户名"
        width="150"
      ></el-table-column>
      <el-table-column label="头像" width="180">
       <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"  min-width="30" height="30" />
      </el-table-column>
      <el-table-column
        prop="nick_name"
        label="昵称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        :formatter="dateFormat"
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="120"></el-table-column>
      <el-table-column label="操作"  width="250">
        <template slot-scope="scope">
          <el-button type="primary" @click="changePwdVisible = true; handlePwd(scope.$index, scope.row);" size="mini">修改密码</el-button>
          <el-button size="mini" @click="submitDeleteAdmin(scope.row.guid)">编辑</el-button>
          <el-button type="danger" size="mini" @click="submitDeleteAdmin(scope.row.guid)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="test()">test</el-button>

    <!-- 分页 -->
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=page
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total=count>
    </el-pagination>
  </div>


  <!------------------- 模态框部分------------- -->
  <!-- 修改密码 -->
  <el-dialog title="修改密码" :visible.sync="changePwdVisible" @close="resetQuery('resetChangePwd')">
    <el-form :model="changePwdForm" ref="resetChangePwd" :rule="changePwdRules">
      <el-form-item label="用户名" :label-width="changePwdWidth" prop="user_name" >
        <el-input v-model="changePwdForm.user_name" autocomplete="off" placeholder="请输入管理员名" :readonly=true></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" :label-width="changePwdWidth" >
        <el-input  type="password" v-model="changePwdForm.password" autocomplete="off" placeholder="请输入6-10个数字或字母" show-password></el-input>
      </el-form-item>
      <el-form-item label="密码确认" prop="checkPassword" :label-width="changePwdWidth">
        <el-input type="password" v-model="changePwdForm.checkPassword" autocomplete="off" placeholder="请输入" show-password></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changePwdVisible = false">取 消</el-button>
      <el-button type="primary" @click="changePwdVisible = false;submitForm('changePwdForm')">确 定</el-button>
    </div>
    
  </el-dialog>

  <!--  增加管理员 -->
  <el-dialog title="新增管理员" :visible.sync="addAdminVisible" @close="resetQuery('resetAddAdmin')">
    <el-form :model="addAdminForm" ref="resetAddAdmin"> 
      <el-form-item label="password">
        <el-input type="password" v-model="addAdminForm.password"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { adminList, adminAdd, adminUpdate, adminUpdatePwd, adminUpdateStatus } from '@/api/admin'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      console.log('password')
        if (value === '') {
            callback(new Error('请输入密码'));
        } else {
          if (this.changePwdForm.checkPassword !== '') {
              this.$refs.changePwdForm.validateField('checkPassword');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.changePwdForm.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
    return {
      adminSearch: {
        user_name: "",
        nick_name: "",
        phone: "",
        searchDate: [1628778843,1681171044 ]
      },
      adminSearchRules: {
        searchDate: [{required: true, message: '请选择',trigger: 'blur'}]
      },
      list: null,
      
      listLoading: false,
      count: 13,
      page: 1,
      limit: 10,
      // 修改密码
      changePwdVisible: false,
      addAdminVisible: false,
      changePwdForm:{
        password: '',
        checkPassword: '',
        user_name: ''
      },
      changePwdWidth: '120px',
      changePwdRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur'}
        ]
      },
      addAdminForm: {
        password: ''
      }
      
    };
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 列表索引值
    indexMethod(index) {
      return index + 1;
    },
    fetchData() {
      this.listLoading = true
      if(!this.adminSearch.searchDate){
        console.log('error')
        var date1 = 0
        var date2 = 0
        var data = this.adminSearch
      }else{
      console.log('here',this.adminSearch)
      var data = this.adminSearch
      var date1 = this.adminSearch.searchDate[0]
      var date2 = this.adminSearch.searchDate[1]}
      var dataPass = ''
      delete data.searchDate
      
      // 组合param里的where和searchDate
      // 并对它们进行json.stringify
      var where = {
        nick_name: data.nick_name,
        phone: data.phone,
        user_name: data.user_name
      },
      where = JSON.stringify(where)
      var searchDate = {
        startDate: date1,
        endDate: date2
      }
      searchDate = JSON.stringify(searchDate)
      // 根据有无传值封装
      if(date1 === 0 || date2 === 0) {
        dataPass = {
          where: where
        }
      }else {
        dataPass = {
          where: where,
          searchDate: searchDate
        }
      }
      // console.log('datapass',dataPass)
      adminList({
        page: this.page,
        limit: this.limit,
        ...dataPass
      }).then(response => {
        console.log(response)
        this.count = response.data.count
        this.list = response.data.data
        this.listLoading = false
      })
    },
    test() {
      this.addAdminVisible = true
  
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    // 把当前条目的值，传入修改密码dialogue
    handlePwd(index, row) {
      console.log(index, row)
      //row是该行tableData对应的一行
      this.changePwdForm = row
    },
    // 13位的时间转成日期格式
    dateFormat(row,column) {
      let date = new Date(parseInt(row.add_time));
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 重置表单提交，也会请求一次无筛选条件的操作
    resetQuery(formName) {
      this.$refs[formName].resetFields() //清除表单内填写的内容
      console.log('clear')
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

  },
};
</script>

<style lang="scss" scope>
.search-container{
  height: 46px;
  .layout_right {
    float: right;
  }
}
.el-pagination{
  text-align: center;
}

</style>