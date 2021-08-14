<template>
    <div class="app-container">
        <!-- 搜索部分 -->
        <div class="search-container">
            <el-form :model="customerSearch" :inline="true" ref="customerSearch" :rules="customerSearchRules">
                <el-form-item prop="guid">
                    <el-input v-model="customerSearch.guid" placeholder="客户ID" clearable style="width:224px"></el-input>
                </el-form-item>
                <el-form-item prop="type" >
                    <el-select v-model="customerSearch.type"  @change="handleType" size="medium">
                        <el-option
                            v-for="item in customerType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="customer_name">
                    <el-input v-model="customerSearch.customer_name" placeholder="客户名称" clearable style="width:224px"></el-input>
                </el-form-item>
                <el-form-item class="layout_right">
                    <el-button type="primary" v-loading="listLoading" @click="fetchData()" icon="el-icon-search">搜索</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="$router.push('/customer/customerAdd')">添加</el-button>
                    <el-button type="primary" icon="el-icon-download">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 列表显示区域 -->
        <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" style="width: 100%" highlight-current-row>
        <el-table-column prop="guid" label="ID" width="300"></el-table-column>
        <el-table-column label="类型" width="150">
            <template scope="scope">
                <span v-if="scope.row.type=== 2" >个人</span>
                <span v-else >企业</span>
            </template>
        </el-table-column>
        <el-table-column label="客户名称" width="180" prop="customer_name">
        </el-table-column>
        <el-table-column  label="联系人姓名" width="200"></el-table-column>
        <el-table-column  label="联系人电话" width="200"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" :formatter="dateFormat" width="250"></el-table-column>
        <el-table-column label="操作"  width="400">
            <template slot-scope="scope">
            <el-button type="primary" @click="changePwdVisible = true; handlePwd(scope.$index, scope.row);" size="mini">新增咨询</el-button>
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row);updateAdminVisible = true;" type="success">转发手机</el-button>
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row);updateAdminVisible = true;">详情</el-button>
            <el-button size="mini" @click="handleAdmin(scope.$index, scope.row);updateAdminVisible = true;">编辑</el-button>
            </template>
        </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page = "page"
            :page-sizes = "[10, 20, 30, 40]"
            :page-size = "limit"
            layout="total, slot, prev, pager, next, jumper"
            :total="count">
            <span style="color:#606266;">每页</span>
                <!-- <el-input class="pageSizeBorder" v-model.number="limit" @input="handlePageSize"></el-input>条 -->
                <el-select v-model="limit"  @change="handleSizeChange" size="mini">
                <el-option
                    v-for="item in page_sizes"
                    :key="item"
                    :value="item"
                    >
                </el-option>
                </el-select>
            <span style="color:#606266;">条</span>
            </el-pagination>
        </div>
        <el-button @click="test()">test</el-button>
    </div>

    
</template>

<script>
import { customerList, customerAdd, logConsultAdd, customerDetail, linkDelete, customerUpdateLink,  customerLinkList} from '@/api/customer'
export default {
    data() {
        // 密码校验

        // 确认密码校验

        return {
            customerType: [
                {'label': '个人',
                'value': 2},
                {'label': '企业',
                'value': 1}
            ],
            customerSearch: {
                guid: '',
                type: '',
                customer_name: '',
            },
            customerSearchRules: {},
            
            // 管理员列表数据渲染 + 分页
            list: null,
            listLoading: false,
            count: 13,
            page: 1,
            limit: 10,
            page_sizes: [10,20,30,40],

            // 添加客户
            // addCustomerVisible: false,
            // addCustomerForm: {
            //     user_name: '',
            //     password: '',
            //     checkPassword: '',
            //     nick_name: '',
            //     phone: ''
            // },
            // addCustomerRules: {
            //     user_name: [
            //     { required: true, message: '请输入昵称', trigger: 'blur' },
            //     { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
            //     ],
            //     password: [
            //     { required: true, message: '请输入密码', trigger: 'blur' },
            //     { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
            //     { validator: validateAddPass, trigger: 'blur' }
            //     ],
            //     checkPassword: [
            //     { required: true, message: '请再次输入密码', trigger: 'blur' },
            //     { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
            //     { validator: validateAddPass2, trigger: 'blur'}
            //     ],
            //     nick_name: [
            //     { required: true, message: '请输入昵称', trigger: 'blur' }
            //     ],
            //     phone: [
            //     {required: true, message: '请输入电话号码', trigger: 'blur'},
            //     {validator: validatePhone, trigger: 'blur'}
            //     ]
            // },
        }
    },
    mounted() {
            this.fetchData()
        },
    methods: {
        // 客户类型
        handleType() {

        },
        // 获取客户列表
        fetchData() {
        this.listLoading = true
        var where = {
            // guid: this.customerSearch.guid,
            type: this.customerSearch.type,
            customer_name: this.customerSearch.customer_name.trim()
        }
        console.log('where',where)
        where = JSON.stringify(where)
        customerList({
            page: this.page,
            limit: this.limit,
            where: where,
        }).then(response => {
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
        // 将后端返回的10位的时间转成日期格式，列表日期列渲染
        dateFormat(row,column) {
        let date = new Date(parseInt(row.add_time)*1000);
        let Y = date.getFullYear() + '-';
        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
        },
        // 测试函数
        test() {
          console.log(this.customerSearch)
        },
    }
}
</script>

<style lang="scss" scoped>
.search-container{
  height: 46px;
  .layout_right {
    float: right;
  }
}
.el-pagination{
  text-align: right;
  
}
</style>