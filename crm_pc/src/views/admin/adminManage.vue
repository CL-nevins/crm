<template>
    <div class="app-container">
        <!-- 条件搜索 -->
        <el-card class="box-card" style="min-height:36px" >
            <el-form ref="searchAdmin" :model="adminSearch" :inline="true" >
                <el-form-item prop="user_name" label-width="">
                    <el-input v-model="adminSearch.user_name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="nick_name" label-width="">
                    <el-input v-model="adminSearch.nick_name" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label-width="">
                    <el-input v-model="adminSearch.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="searchDate" label-width="">
                    <el-date-picker v-model="adminSearch.searchDate" type="daterange" start-placeholder="创建开始日期" end-placeholder="创建结束日期" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item class="layout_right">
                    <el-button type="primary" v-loading="listLoading" @click="fetchData()" icon="el-icon-search">搜索</el-button>
                    <el-button type="primary" icon="el-icon-edit">添加</el-button>
                    <el-button type="primary" icon="el-icon-download">导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 数据展示区 调试区 -->
        <p>日期值：{{ adminSearch.searchDate }} 数据总计: {{ count }}</p>

        <!-- 列表显示区域 -->
        <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" style="width:100%" highlight-current-row>
            <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
            <el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
            <el-table-column prop="avatar" label="头像" width="150"></el-table-column>
            <el-table-column prop="nick_name" label="昵称" width="150"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
            <el-table-column prop="add_time" label="创建时间" width=""></el-table-column>
            <el-table-column prop="status" label="状态" width="120"></el-table-column>
            <el-table-column label="操作" fixed="right" width='250'>
                <template slot-scope="scope">
                    <el-button type="primary" @click="updateAdminFormVisible = true;storeUpdateGuid(scope.row.guid)"  size="mini">修改密码</el-button>
                    <el-button size="mini" @click="submitDeleteAdmin(scope.row.guid)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="submitDeleteAdmin(scope.row.guid)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            adminSearch: {
                user_name: '',
                nick_name: '',
                phone: '',
                searchDate: ''
            },
            // list: null,
            list: [{
                user_name: 'aaa',
                avatar: '',
                nick_name: '',
                phone: '123',
                add_time: '111',
                status: '1',
            },
            {
                user_name: '222',
                avatar: '',
                nick_name: '',
                phone: '123',
                add_time: '111',
                status: '1',
            },
            {
                user_name: '222',
                avatar: '',
                nick_name: '',
                phone: '123',
                add_time: '111',
                status: '1',
            }],
            listLoading: false,
            count: 2,
        }
    },
    methods:{
        indexMethod(index) {
            return index+1
        }
    }
}
</script>

<style lang="scss" scope>
    .layout_right {
        float: right;
    }
</style>