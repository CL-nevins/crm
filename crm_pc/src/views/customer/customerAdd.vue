<template>
    <div class="app-container">
        <div class="box-container">
            <div class="wrapper">
                <!-- 步骤条 -->
                <el-steps :active="active" finish-status="success">
                <el-step description="填写基础信息"></el-step>
                <el-step description="填写联系人信息"></el-step>
                </el-steps>

                <!-- 填写基础信息表单 -->
                <el-form v-if="active === 0" :model="basicInfo" ref="basicInfo" label-width="80px" :rules="basicInfoRules" class="basicInfo-style">
                    <el-form-item label="客户类型" prop="type">
                        <el-select v-model="basicInfo.type" placeholder="请选择" @change="resetQuery('moreInfo')">
                            <el-option
                            v-for="item in customerType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户名称" prop="customer_name">
                        <el-input v-if="basicInfo.type === 1" v-model="basicInfo.customer_name" auto-complete="off" placeholder="请输入完整企业名称"></el-input>
                        <el-input v-if="basicInfo.type === 2" v-model="basicInfo.customer_name" auto-complete="off" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="margin-top: 12px;" @click="next('basicInfo')" type="primary">下一步</el-button>
                    </el-form-item>
                </el-form>

                <!-- 详细信息表单 -->
                <el-form v-if="active === 1" :model="moreInfo" ref="moreInfo" label-width="80px" :rules="moreInfoRules" class="moreInfo-style">
                    <el-form-item v-if="basicInfo.type === 1" prop="name" label="姓名">
                        <el-input v-model="moreInfo.name" placeholder="请输入2-20个中文或英文字符" clearable style="width:360px"></el-input>
                    </el-form-item>
                    <el-form-item prop="gender" label="性别">
                        <el-select v-model="moreInfo.gender" placeholder="请选择" size="small">
                            <el-option
                            v-for="item in genderType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="电话" prop="phone">
                        <el-input v-model="moreInfo.phone" placeholder="请输入" clearable style="width:360px" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="生日" prop="birthday">
                        <el-date-picker v-model="moreInfo.birthday" style="width:224px" placeholder="选择日期" value-format="timestamp" format="yyyy 年 MM 月 dd 日"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input placeholder="请输入" clearable style="width:360px" v-model="moreInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="city">
                        <el-cascader
                            :options="options"
                            ref="cascaderCity"
                            :props="xprops"
                            v-model="moreInfo.city"
                            @change="handleCityChange"
                            placeholder="请选择省市区"
                            style="width:360px">
                         </el-cascader>
                    </el-form-item>
                    <el-form-item label="" prop="address">
                        <el-input v-model="moreInfo.address" placeholder="请输入" clearable style="margin-top:0px;width:360px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="margin-top: 12px;" @click="prev()" type="primary">上一步</el-button>
                        <el-button style="margin-top: 12px;" @click="submitCustomerInfo('moreInfo')">提交</el-button>
                        <!-- <el-button @click="test()">test</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
    </div>
</template>

<script>
import { customerList, customerAdd, logConsultAdd, customerDetail, linkDelete, customerUpdateLink,  customerLinkList} from '@/api/customer'
const pcas = require('../../assets/pca-code.json')

export default {
    data() {
        // 电话校验
        const validateTel = (rule, value, callback) => {
            let reg = /^1[345789]\d{9}$/
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        // 邮箱校验
        const validateEmail = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!reg.test(value)) {
                callback(new Error('请输入正确的邮箱地址'))
            } else {
                callback()
            }
        }
        return {
            listLoading: false,
            active:0,
            basicInfo: {
                type: 1,
                customer_name: '',
            },
            customerType: [
                {'label': '个人',
                'value': 2},
                {'label': '企业',
                'value': 1}
            ],
            genderType: [
                {'label': '男',
                'value': 1},
                {'label': '女',
                'value': 2}
            ],
            basicInfoRules: {
                type: [
                    {required: true, message:'请选择客户类型', trigger: 'blur'}
                ],
                customer_name: [
                    {required: true, message:'请输入客户信息', trigger: 'blur'},
                    
                ]
            },
            moreInfo: {
                name: '',
                gender: 1,
                phone: '',
                birthday: 0,
                email: '',
                city: '',
                address: ''
            },
            restoreCity:'',
            moreInfoRules: {
                name: [
                    // {required: true, message:'请输入联系人姓名', trigger: 'blur'},
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
                ],
                gender: [
                    {required: true, trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入电话号码', trigger: 'blur'},
                    {validator: validateTel, trigger: 'blur'},
                    { min: 11, max: 11, trigger: 'blur' },
                ],
                email: [
                    // {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {validator: validateEmail, trigger: 'blur'}
                ],
                city: [
                    {required: true, message:'请选择地区', trigger: 'blur'}
                ],
                address: [
                    {required: true, message:'请输入详细地址', trigger: 'blur'},
                    { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' },
                ]
            },
            // 地址级联
            options: pcas,
            xprops: {
            value: 'code',
            label: 'name',
            },
        }
    },
    methods: {
      next(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                if (this.active++ > 1) this.active = 0;
              }else {
                  this.$message.error('校验失败，请检查输入');
          return false;
              }
          })
      },
      prev(){
          if (this.active === 1) 
           this.active = 0;
      },
      // 提交添加客户表单
      submitCustomerInfo(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.listLoading = true;
                  this.$message ({
                      message: '校验通过，提交',
                      type: 'success'
                  })
                  // 组合数据，个人客户type为2，名字就是customer_name
                  // 企业客户type为1，企业名字是customer_name，联系人名是name，name和phone可能有多个
                  let data = {
                      type: this.basicInfo.type,
                      customer_name: this.basicInfo.customer_name.trim(),
                      name: this.moreInfo.name.trim(),
                      phone: this.moreInfo.phone.trim(),
                      gender: this.moreInfo.gender,
                      birthday: this.moreInfo.birthday/1000,
                      email: this.moreInfo.email.trim(),
                      city: this.restoreCity.trim(),
                      address: this.moreInfo.address.trim()
                  }
                  console.log('data',data)
                  // 调用函数
                  customerAdd(data).then(response => {
                      this.listLoading = false
                  })
              } else {
                  this.$message.error('校验失败，请检查输入')
                  return false
              }
          })
      },
      // 获取省市区的地址级联
      handleCityChange(e, form, thsAreaCode) {
        thsAreaCode = this.$refs['cascaderCity'].getCheckedNodes()[0].pathLabels
        console.log(thsAreaCode)
        this.restoreCity = thsAreaCode[0] + thsAreaCode[1] + thsAreaCode[2]
        console.log(this.restoreCity)
    },
    resetQuery(formName) {
        if (this.$refs[formName]!==undefined) {
  	        this.$refs[formName].resetFields()
        }else{
            console.log("aaa")
        }
    //   this.$refs[formName].resetFields() 
    //   console.log('clear')
    },
    // 测试函数
    test() {
        console.log(this.moreInfo.birthday)
        console.log('aaaa')
        
    },
    }
}
</script>

<style lang='scss' scoped>
.app-container{
    background-color: rgb(240, 242, 245);
    position: relative;
    .box-container {
        background-color: white;
        position: relative;
        overflow: hidden;
        .wrapper {
            background-color: white;
            // position: absolute;
            width:50%;
            margin-left: 25%;
            margin-top: 3%;
        }
    }
    .basicInfo-style{
        margin-top: 20px;
    }
    .moreInfo-style{
        margin-top: 20px;
    }

}
.el-steps{
    .el-step{
        .el-step-head{

        }
        .el-step-main{
            margin-top:30px;
        }
    }
}
</style>