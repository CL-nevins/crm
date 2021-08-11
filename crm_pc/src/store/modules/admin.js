// 可能要admin换一下
import { login, logout, getInfo } from '@/api/admin'
// 三个request的引入
import { getToken, setToken, removeToken, getGuid, setGuid, removeGuid } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    guid: getGuid(),
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_GUID: (state, guid) => {
    state.guid = guid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // admin login
  login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
      login({
        admin_name: userInfo.username.trim(),
        password: userInfo.password,
        captcha: userInfo.verifycode,
        captchaNum: userInfo.number
         }).then(response => {
        const{ data } = response
        // tah得到response
        // tah将返回来的token和guid 更新为当前两参数的状态
        commit('SET_TOKEN', data.token)
        commit('SET_GUID', data.guid)
        // tah将返回来的token和guid写入Cookie中
        setToken(data.token)
        setGuid(data.guid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get admin info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({}).then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // admin logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({
        guid: state.guid,
        token: state.token
      }).then(() => {
        removeToken() // must remove  token  first
        removeGuid() // tah移除guid
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeGuid() // tah移除guid
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

