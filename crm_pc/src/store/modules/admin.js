import { login, logout, getInfo } from '@/api/admin'
import { getToken, setToken, removeToken, getGuid, setGuid, removeGuid } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    guid: getGuid(),
    token: getToken(),
    nick_name: '',
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
  },
  SET_NICKNAME: (state, nick_name) => {
    state.nick_name = nick_name
  }
}

const actions = {
  // 管理员登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login({
        username: userInfo.username.trim(),
        password: userInfo.password,
        captcha: userInfo.verifycode,
        number: userInfo.number
      }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_GUID', data.guid)
        setToken(data.token)
        setGuid(data.guid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取管理员信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      // 这里param传个空对象过去
      getInfo({}).then(response => {
        const { data } = response
        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        // 拿到后端data数据后，赋值
        // 只赋值nick_name ; avatar
        // 后端返回的avatar现在是"---""
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        const { nick_name, avatar } = data
        commit('SET_NICKNAME', nick_name)
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
      // logout要传什么业务参数
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

