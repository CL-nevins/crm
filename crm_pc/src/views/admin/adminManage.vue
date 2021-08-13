<template>
  <div class="app-container">
    <!-- 条件搜索 -->
    <div class="search-container">
      <el-form :model="adminSearch" :inline="true" ref="adminSearch" :rules="adminSearchRules">
        <el-form-item prop="user_name">
          <el-input v-model="adminSearch.user_name" placeholder="用户名" clearable style="width:224px"></el-input>
        </el-form-item>
        <el-form-item prop="nick_name" >
          <el-input v-model="adminSearch.nick_name" placeholder="昵称" clearable style="width:224px"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="adminSearch.phone" placeholder="手机号" clearable style="width:124px"></el-input>
        </el-form-item>
        <el-form-item prop="searchDate">
          <el-date-picker v-model="adminSearch.searchDate" type="daterange" start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="timestamp" :default-time="['00:00:00', '23:59:59']" style="width:400px"></el-date-picker>
        </el-form-item>
        <el-form-item class="layout_right">
          <el-button type="primary" v-loading="listLoading" @click="fetchData()" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="addAdminVisible = true;">添加</el-button>
          <el-button type="primary" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据展示区 调试区 -->
    <!-- <p>日期值：{{ adminSearch.searchDate }} 数据总计: {{ count }}</p> -->

    <!-- 列表显示区域 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" style="width: 100%" highlight-current-row>
      <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
      <el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
      <el-table-column label="头像" width="180">
       <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"  min-width="30" height="30" />
      </el-table-column>
      <el-table-column prop="nick_name" label="昵称" width="200"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" :formatter="dateFormat" width="250"></el-table-column>
      <el-table-column label="状态" >
        <template scope="scope">
          <span v-if="scope.row.status=== 1" id="statusDot1">正常</span>
          <span v-else id="statusDot2">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="250">
        <template slot-scope="scope">
          <el-button type="primary" @click="changePwdVisible = true; handlePwd(scope.$index, scope.row);" size="mini">修改密码</el-button>
          <el-button size="mini" @click="handleAdmin(scope.$index, scope.row);updateAdminVisible = true;">编辑</el-button>
          <el-button type="danger" size="mini" v-if="scope.row.status === 1" @click="disableAdmin(scope.$index,scope.row)">禁用</el-button>
          <el-button type="success" size="mini" v-if="scope.row.status === 2" @click="enableAdmin(scope.$index,scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="test()">test</el-button>

    <!-- 分页 -->
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page = "page"
      :page-sizes = "[10, 20, 30, 40]"
      :page-size = "limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
  </div>


  <!------------------- 模态框部分------------- -->
  <!-- 修改密码 -->
  <el-dialog title="修改密码" :visible.sync="changePwdVisible" @close="resetQuery('changePwdForm')">
    <el-form :model="changePwdForm" ref="changePwdForm" :rules="changePwdRules" label-width="142px">
      <el-form-item label="用户名"  prop="user_name" >
        <el-input v-model="changePwdForm.user_name" autocomplete="off" :readonly=true style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input  type="password" v-model="changePwdForm.password" autocomplete="off" placeholder="请输入6-10个数字或字母" show-password style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="密码确认" prop="checkPassword">
        <el-input type="password" v-model="changePwdForm.checkPassword" autocomplete="off" placeholder="请输入" show-password style="width:220px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="changePwdVisible = false">取 消</el-button>
      <el-button type="primary" @click="changePwdVisible = false;submitPwd('changePwdForm')">确 定</el-button>
    </div>
  </el-dialog>


  <!-- 修改管理员信息 -->
  <el-dialog title="编辑" :visible.sync="updateAdminVisible" @close="resetQuery('updateAdminForm')">
    <el-form :model="updateAdminForm" ref="updateAdminForm" :rules="updateAdminRules" label-width="142px">
      <el-form-item label="用户名"  prop="user_name" >
        <el-input v-model="updateAdminForm.user_name" autocomplete="off" :readonly=true style="width:220px;"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick_name" >
        <el-input v-model="updateAdminForm.nick_name" autocomplete="off" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" >
        <el-input v-model="updateAdminForm.phone" autocomplete="off" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :disabled=true
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <p style="margin-left:142px;color:rgba(0,0,0,0.45);font-size:14px">支持jpg，jpeg，png格式，图片大小不超过2M</p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="updateAdminVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateAdminVisible = false;submitUpdate('updateAdminForm')">确 定</el-button>
    </div>
  </el-dialog>


  <!--  增加管理员 -->
  <el-dialog title="新增管理员" :visible.sync="addAdminVisible" @close="resetQuery('addAdminForm')">
    <el-form :model="addAdminForm" ref='addAdminForm' label-width="142px" :rules="addAdminRules"> 
      <el-form-item label="用户名"  prop="user_name" >
        <el-input v-model="addAdminForm.user_name" autocomplete="off" style="width:220px;margin-left:44px" placeholder="请设置6-20位数字或字母"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input  type="password" v-model="addAdminForm.password" autocomplete="off" placeholder="请输入6-10个数字或字母" show-password style="width:220px;margin-left:44px"></el-input>
      </el-form-item>
      <el-form-item label="密码确认" prop="checkPassword">
        <el-input type="password" v-model="addAdminForm.checkPassword" autocomplete="off" placeholder="请再次输入密码" show-password style="width:220px;margin-left:44px"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick_name" >
        <el-input v-model="addAdminForm.nick_name" autocomplete="off" style="width:220px;margin-left:44px" placeholder="请输入4-12位中英文字符"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" >
        <el-input v-model="addAdminForm.phone" autocomplete="off" style="width:220px;margin-left:44px" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :disabled=true style="margin-left:44px"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
       <p style="margin-left:142px;color:rgba(0,0,0,0.45);font-size:14px">支持jpg，jpeg，png格式，图片大小不超过2M</p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addAdminVisible = false">取 消</el-button>
      <el-button type="primary" @click="addAdminVisible = false;submitAdd('addAdminForm')">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import { adminList, adminAdd, adminUpdate, adminUpdatePwd, adminUpdateStatus } from '@/api/admin'
export default {
  data() {
    // 密码校验
    var validatePass = (rule, value, callback) => {
      let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
        if (!reg.test(value)) {
            callback(new Error('密码需以字母开头'));
        } else {
          if (this.changePwdForm.checkPassword !== '') {
              this.$refs.changePwdForm.validateField('checkPassword');
          }
          callback();
        }
      };
      // 密码确认校验
    var validatePass2 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.changePwdForm.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
      // 密码校验
    var validateAddPass = (rule, value, callback) => {
      let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
        if (!reg.test(value)) {
            callback(new Error('密码需以字母开头'));
        } else {
          if (this.addAdminForm.checkPassword !== '') {
              this.$refs.addAdminForm.validateField('checkPassword');
          }
          callback();
        }
      };
      // 密码确认校验
    var validateAddPass2 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.addAdminForm.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
    var validatePhone = (rule, value, callback) => {
      let reg = /^1[345789]\d{9}$/
      if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
      } else {
          callback()
      }
    }
    return {
      // 管理员搜索相关
      adminSearch: {
        user_name: "",
        nick_name: "",
        phone: "",
        searchDate: [1628778843,1681171044 ]
      },
      adminSearchRules: {
        searchDate: [{required: true, message: '请选择',trigger: 'blur'}]
      },

      // 管理员列表数据渲染 + 分页
      list: null,
      listLoading: false,
      count: 13,
      page: 1,
      limit: 10,


      // 修改密码相关
      changePwdVisible: false,
      changePwdForm:{
        password: '',
        checkPassword: '',
        user_name: ''
      },
      changePwdRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur'}
        ]
      },

      // 添加管理员相关
      addAdminVisible: false,
      addAdminForm: {
        user_name: '',
        password: '',
        checkPassword: '',
        nick_name: '',
        phone: ''
      },
      addAdminRules: {
        user_name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: validateAddPass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: validateAddPass2, trigger: 'blur'}
        ],
        nick_name: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: validatePhone, trigger: 'blur'}
        ]
      },

      // 更新管理员相关
      updateAdminVisible: false,
      updateAdminForm: {
        user_name: '',
        nick_name: '',
        phone: '',
        avatar: ''
      },
      imageUrl: '',
      updateAdminRules: {
        nick_name: [{ required: true, message: '请输入昵称', trigger: 'blur' },],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: validatePhone, trigger: 'blur'}
          ]
      },
    };
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 列表索引值渲染
    indexMethod(index) {
      return index + 1;
    },
    // 13位的时间转成日期格式，列表日期列渲染
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
    // 弹出禁用管理员消息框
    disableAdmin(index,row) {
      this.$confirm('是否禁用此用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-message-solid'
        }).then(() => {
          adminUpdateStatus(
            {
              admin_guid: row.guid,
              status: 2
            }
          )
          this.fetchData()
          this.$message({
            type: 'warning',
            message: '已禁用'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          });          
        });
    },
    // 弹出启用管理员消息框
    enableAdmin(index,row) {
      this.$confirm('是否启用此用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-message-solid'
        }).then(() => {
          adminUpdateStatus(
            {
              admin_guid: row.guid,
              status: 1
            }
          )
          this.fetchData()
          this.$message({
            type: 'warning',
            message: '已启用'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          });          
        });
    },
    // 获取管理员列表
    fetchData() {
      this.listLoading = true
      if(!this.adminSearch.searchDate){
        console.log('searchDate not exit')
        var date1 = 0
        var date2 = 0
        var data = this.adminSearch
      }else{
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
      adminList({
        page: this.page,
        limit: this.limit,
        ...dataPass
      }).then(response => {
        // 获取到的列表值，在这里赋值
        this.count = response.data.count
        this.list = response.data.data
        this.listLoading = false
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
			this.page = 1;
			this.limit = val;
      console.log('pagesize',this.limit)
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log('当前页: ${val}')
      this.page = val
      console.log('page',this.page)
      this.fetchData()
      // this.sendPagination(val)
    },
    // 分页值发给后端
    sendPagination(val){

    },
    // 把当前条目的值，传入修改密码dialog
    handlePwd(index, row) {
      console.log(index, row)
      //row是admin list对应的一行
      this.changePwdForm = row
    },
    // 提交密码修改请求
    submitPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '校验通过，提交',
            type: 'success'
          })
          let data = {
            admin_guid: this.changePwdForm.guid,
            password: this.changePwdForm.password
          }
          // 调用adminUpdatePwd函数
          adminUpdatePwd(data)
        } else {
          this.$message.error('校验失败，请检查输入');
          return false;
        }
      });
      },
    // 把当前条目的值，传入编辑管理员dialog
    handleAdmin(index, row) {
      console.log(index, row)
      this.updateAdminForm = row
    },
    // 提交管理员信息更改
    submitUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '校验通过，提交',
            type: 'success'
          })
          let data = {
            admin_guid: this.updateAdminForm.guid,
            nick_name: this.updateAdminForm.nick_name,
            phone: this.updateAdminForm.phone
          }
          // 调用adminUpdatePwd函数
          adminUpdate(data)
        } else {
          this.$message.error('校验失败，请检查输入');
          return false;
        }
      });
    },
    // 添加管理员
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '校验通过，提交',
            type: 'success'
          })
          let data = {
            user_name: this.addAdminForm.user_name,
            password: this.addAdminForm.password,
            nick_name: this.addAdminForm.nick_name,
            phone: this.addAdminForm.phone,
            avatar: '---'
          }
          // 调用adminUpdatePwd函数
          adminAdd(data)
        } else {
          this.$message.error('校验失败，请检查输入');
          return false;
        }
      });
    },
    // 重置表单内容
    resetQuery(formName) {
      this.$refs[formName].resetFields() //清除表单内填写的内容
    },
    
      // 测试函数，配合界面上的test按钮，调试
      test() {
            this.addAdminVisible = true
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
#statusDot1{
  &::before{
    content: '';
    background-image: url('../../assets/dot1.svg');
    background-size:6px 6px;
    position: absolute;
    width:6px;
    height:6px;
    z-index: 100;
    left:0;
    top:28px;
  } 
}
#statusDot2{
  &::before{
    content: '';
    background-image: url('../../assets/dot2.svg');
    background-size:6px 6px;
    position: absolute;
    width:6px;
    height:6px;
    z-index: 100;
    left:0;
    top:28px;
  } 
}
.el-pagination{
  text-align: center;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 104px;
    height: 104px;
    line-height: 104px;
    text-align: center;
  }
  .avatar {
    width: 104px;
    height: 104px;
    display: block;
  }
</style>
