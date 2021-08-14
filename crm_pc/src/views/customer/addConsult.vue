<template>
  <div class="app-container">
      <div class="box-container">
          <div class="wrapper">
            <el-form :model="consultForm" ref="consultForm" :rules="consultRules" label-width="100px" v-loading="listLoading">
              <el-form-item label="通话时长" prop="duration">
                <el-select v-model="consultForm.duration" placeholder="请选择">
                  <el-option 
                  v-for="item in durationType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="沟通内容" prop="content">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请简要说明沟通的情况"
                  maxlength="120"
                  show-word-limit
                  resize="none"
                  v-model="consultForm.content">
                </el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请备注客户跟进进度以及客户需求"
                  maxlength="120"
                  show-word-limit
                  resize="none"
                  v-model="consultForm.remark">
                </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button style="margin-top: 12px;" @click="submitConsult('consultForm')" type="primary">提交</el-button>
                  <el-button style="margin-top: 12px;" @click="cancel()">取消</el-button>
                  <!-- <el-button @click="test()">test</el-button> -->
              </el-form-item>
            </el-form>
          </div>
      </div>
      
  </div>
</template>

<script>
import { logConsultAdd } from '@/api/customer'

export default {
  data() {
    return {
      listLoading: false,
      consultForm: {
        duration: 300,
        content: '',
        remark: ''
      },
      consultRules: {
        duration: [
          {required: true, message: '请输入', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入', trigger: 'blur'}
        ],
        remark: [
          {required: true, message: '请输入', trigger: 'blur'}
        ]
      },
      durationType: [
        {'label': '1分钟内',
        'value': 60},
        {'label': '5分钟内',
        'value': 300},
        {'label': '10分钟内',
        'value': 600},
        {'label': '30分钟内',
        'value': 1800},
        {'label': '1小时内',
        'value': 3600},
        {'label': '大于1小时',
        'value': 7200},
      ]

    }
  },
  methods: {
    cancel() {
      this.$router.push({
        path: `/customer/customerList`,
      })
    },
    submitConsult(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          this.$message ({
              message: '校验通过，提交',
              type: 'success'
          })
          let data = {
            customer_guid: this.$route.params.guid,
            duration: this.consultForm.duration,
            content: this.consultForm.content.trim(),
            remark: this.consultForm.remark.trim()
          }
          logConsultAdd(data).then(response => {
            this.listLoading = false
            this.$router.push({
              path: `/customer/customerList`,
            })
          })
        }else {
            this.$message.error('校验失败，请检查输入');
            return false;
        }
      })
    }
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
            width:70%;
            margin-left: 15%;
            margin-top: 3%;
        }
    }
}
</style>