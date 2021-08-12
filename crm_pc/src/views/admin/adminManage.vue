<template>
  <div class="app-container">
    <!-- 条件搜索 -->
    <div class="search-container">
      <el-form :model="adminSearch" :inline="true">
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
    <p>日期值：{{ adminSearch.searchDate }} 数据总计: {{ count }}</p>

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
      <el-table-column prop="avatar" label="头像" width="180"></el-table-column>
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
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="120"></el-table-column>
      <el-table-column label="操作"  width="250">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="
              changePwdVisible = true;
              storeGuid(scope.row.guid);
            "
            size="mini"
            >修改密码</el-button
          >
          <el-button size="mini" @click="submitDeleteAdmin(scope.row.guid)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="submitDeleteAdmin(scope.row.guid)"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="test()">aaa</el-button>
  </div>
</template>

<script>
import { adminList, adminAdd, adminUpdate, adminUpdatePwd, adminUpdateStatus } from '@/api/admin'
export default {
  data() {
    return {
      adminSearch: {
        user_name: "",
        nick_name: "",
        phone: "",
        searchDate: [0,0]
      },
      // list: null,
      list: [
        {
          user_name: "aaa",
          guid: "ggggg001",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg002",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg003",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg004",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg005",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg006",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg007",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg008",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "aaa",
          guid: "ggggg009",
          password: '',
          avatar: "",
          nick_name: "",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "admin01",
          guid: "ggggg010",
          password: '',
          avatar: "",
          nick_name: "john",
          phone: "45555",
          add_time: "111",
          status: "0",
        },
        {
          user_name: "admin02",
          guid: "ggggg011",
          password: 'aasd',
          avatar: "",
          nick_name: "andy",
          phone: "122131233",
          add_time: "111",
          status: "0",
        },
        {
          user_name: "admin03",
          guid: "ggggg012",
          password: '',
          avatar: "",
          nick_name: "lucy",
          phone: "123",
          add_time: "111",
          status: "1",
        },
        {
          user_name: "admin04",
          guid: "ggggg013",
          password: '',
          avatar: "",
          nick_name: "Trump",
          phone: "123",
          add_time: "111",
          status: "0",
        },
        
      ],
      listLoading: false,
      count: 2,
      page: 1,
      limit: 10,
    };
  },
  mounted() {
    // this.fetchData()
  },
  methods: {
    // 列表索引值
    indexMethod(index) {
      return index + 1;
    },
    fetchData() {
      this.listLoading = true
      let data = this.adminSearch
      delete data.searchDate
      // data.searchDate = {
      //   startDate: 0,
      //   endDate: 0
      // }
      console.log('data',data)
      // data.startDate = this.adminSearch.searchDate[0]
      // data.endDate = this.adminSearch.searchDate[1]
      
      // delete data.searchDate
      adminList({
        page: this.page,
        limit: this.limit,
        where: {
          ...this.data
        }
        
      })
    },
    test() {
      console.log(typeof(this.adminSearch.searchDate))
      console.log(this.adminSearch.searchDate[0])
      console.log(this.adminSearch.searchDate[1])
      this.fetchData()
    }
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

</style>