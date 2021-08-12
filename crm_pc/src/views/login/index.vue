<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">客户关系管理系统</h3>
      </div>

      <!-- 输入用户名 -->
      <!-- icon-class，用的是svg封装，在icons/svg里 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!-- 输入验证码 verifycode-->
      <el-form-item prop="verifycode">
        <div class="verifycode">
          <el-input
            ref="verifycode"
            v-model="loginForm.verifycode"
            placeholder="验证码"
            name="verifycode"
            type="text"
            tabindex="3"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
          />
          <img :src="verifyCodeUrl" alt="验证码" class="code" @click="changeVerifyCode()">
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        tabindex="4"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
// import { validUsername, validPwd, validCode } from '@/utils/validate'
import { validLoginUsername, validLoginPwd, validVerifyCode } from '@/utils/validate'
import { randomNum } from '@/utils/common'

export default {
  name: 'Login',
  data() {
    // 用户名验证
    const validateUsername = (rule, value, callback) => {
      callback(validLoginUsername(value))
    }
    const validatePassword = (rule, value, callback) => {
      callback(validLoginPwd(value))
    }
    const validateVerifycode = (rule, value, callback) => {
      callback(validVerifyCode(value))
    }

    return {
      loginForm: {
        username: 'niewenzhi',
        password: 'niewenzhi', // 密码只校验了长度，没有校验过是否相等；
        verifycode: '',
        number: randomNum()
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifycode: [{ required: true, trigger: 'blur', validator: validateVerifycode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    verifyCodeUrl() {
      return process.env.VUE_APP_BASE_API + '/api/captcha/' + this.loginForm.number
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 显隐密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 点击验证码区，重新生成一个随机数来请求验证码
    changeVerifyCode() {
      this.loginForm.number = randomNum()
    },
    // 点击登录按钮，触发函数
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // this.$router.push({ path: this.redirect || '/' })
            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('提交错误')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    background-image: url('../../assets/asd.jpg');
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: black;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      margin-bottom: 30px;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    // background-color: green;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        color:darkblue;
        font-size: 34px;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .verifycode {
      display: flex;
      .code {
        cursor: pointer;
        height: 52px;
      }
    }
  }
</style>
