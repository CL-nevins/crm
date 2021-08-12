const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  guid: state => state.user.guid,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nick_name: state => state.user.nick_name,
  phone: state => state.user.phone
}
export default getters
