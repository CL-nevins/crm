<template>
  <div class="app-container">
    <!-- 客户基本信息显示区 -->
      <div class="customer-container">
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple"><span>客户ID：</span>{{this.$route.params.guid}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="grid-content bg-purple"><span>名称：</span>{{customer.customer_name}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><span>类型：</span>{{customer.showType}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple"><span>创建时间：</span>{{customer.add_time}}</div></el-col>
        </el-row>
        <el-row class="tabIndex">
          <a>客户信息</a>
          <a style="margin-left:20px">咨询列表</a>
        </el-row>
        <div class="ctrlBtn">
          <el-button size="mini">转发手机</el-button>
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="primary">新增咨询</el-button>
        </div>
      </div>
    
    <!-- 联系人列表 分企业和个人写吧 -->
    <!-- 个人客户 -->
      <div class="link-container" v-if="customer.type === 2">
        <p>联系人列表</p>
        <template>
          <div>
            <el-row>
              <el-col :span="18">{{customer.customer_name}}</el-col>
              <el-col :span="6" style="text-align:right;">
                <a style="color:#1890FF;margin-right:20px" >编辑</a>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">姓名:{{customer.customer_name}}</el-col>
              <el-col :span="8">联系电话:{{link.phone}}</el-col>
              <el-col :span="8">性别:{{this.genderType(link.gender)}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出生日期:{{link.birthday.slice(0,10)}}</el-col>
              <el-col :span="8">联系邮箱:{{link.email}}</el-col>
              <el-col :span="8">联系地址:{{link.address}}</el-col>
            </el-row>
          </div>
        </template>
      </div>

      <!-- 企业客户 -->
      <div class="link-container" v-if="customer.type === 1">
        <p>联系人列表<a style="color:#1890FF;margin-right:20px;float:right" >添加联系人</a></p>
        <template>
          <div v-for="(item, phone) in link" :key="phone">
            <el-row>
              <el-col :span="18">{{item.name}}</el-col>
              <el-col :span="6" style="text-align:right;">
                <a style="color:#1890FF;margin-right:20px" >编辑</a>
                <a style="color:#1890FF;margin-right:20px" >删除</a>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">姓名:{{item.name}}</el-col>
              <el-col :span="8">联系电话:{{phone}}</el-col>
              <el-col :span="8">性别:{{genderType(item.gender)}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">出生日期:{{item.birthday.slice(0,10)}}</el-col>
              <el-col :span="8">联系邮箱:{{item.email}}</el-col>
              <el-col :span="8">联系地址:{{item.address}}</el-col>
            </el-row>
          </div>
        </template>
      </div>

    <!-- 电话咨询记录 列表 -->
      <div class="log-container">
        <p>电话咨询记录 <a style="color:#1890FF;margin-right:20px;float:right">查看更多</a></p>
        <template>
          <el-table :data="log" style="width:100%">
            <el-table-column  label="操作人">null</el-table-column>
            <el-table-column prop="" label="提交时间">null</el-table-column>
            <el-table-column prop="duration" label="通话时长" :formatter="durationFormatter"></el-table-column>
            <el-table-column prop="content" label="沟通内容"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </template>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { customerDetail } from '@/api/customer'

export default {
  data() {
    return {
      
      customer: {
        customer_name: '',
        type: '',
        showType: '',
        add_time: ''
      },
      link_length: 1, // 联系人个数
      link: [],
      log_length: 1, // 咨询记录数量
      log: [],

    }
  },
  mounted() {
    this.getCustomerDetail()
  },
  methods: {
    getCustomerDetail() {
      customerDetail(
        {
          customer_guid: this.$route.params.guid,
        }
      ).then(response => {
       
        // 开始赋值
        this.customer = response.data.customer[0]
        this.customer.add_time = this.dateFormat(this.customer.add_time)
        if(this.customer.type === 1){
          this.customer.showType = '企业'
          this.link = response.data.link // 数组赋值
          this.link_length = this.link.length
        }else{
          this.customer.showType = '个人'
          this.link = response.data.link[0]
          this.link_length = this.link.length
        }
        this.log = response.data.log
        this.log_length = this.log.length

        console.log('link',this.link)
        console.log('log',this.log)
      })
    },
    // 将后端返回的13位的时间转成日期格式，列表日期列渲染
    dateFormat(time) {
      let date = new Date(parseInt(time)*1000);
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 性别判断
    genderType(gender){
      let a = ''
      if(gender === 1){
        a = '男'
      }else {
        a = '女'
      }
      return a
    },
    // 通话时长判断
    durationFormatter(row, column, cellValue, index){
      let a = ''
      switch(cellValue) {
        case 60:
          a = '1分钟'
          break
        case 300:
          a= '5分钟'
          break
        case 600:
          a = '10分钟'
          break
        case 1800:
          a = '30分钟'
          break
        case 3600:
          a = '1小时'
          break
        case 7200:
          a = '大于1小时'
          break
      }
      return a
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container{
    background-color: rgb(240, 242, 245);
    padding: 0;
    .customer-container {
      position: relative;
      width: 100%;
      background-color: white;
      overflow: hidden;
      .el-row{
        margin-top: 20px;
        margin-left: 34px;
        &:last-of-type{
          color: red;
        }
        
      }
      .ctrlBtn{
        position: absolute;
        top: 30px;
        right: 30px
      }
    }
    .link-container{
      margin:20px;
      background-color: white;
      overflow: hidden;
      p{
        border-bottom: solid 1px #E9E9E9;
        margin-top: 13px;
        margin-left: 20px;
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        line-height: 24px;
      }
       .el-row{
        margin-top: 20px;
        margin-left: 34px;
        &:last-child {
          margin-bottom: 20px;
        }
      }
    }
    .log-container{
      margin:20px;
      background-color: white;
      overflow: hidden;
      p{
        border-bottom: solid 1px #E9E9E9;
        margin-top: 13px;
        margin-left: 20px;
        font-size: 16px;
        color: rgba(0,0,0,0.85);
        line-height: 24px;
      }
      .el-table {
        margin:0 5% 0 5%;
      }
    }
}
</style>