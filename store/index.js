/* eslint-disable camelcase */
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'
import API from '~/utils/api'

export const state = () => ({
  isUserLoggedIn: false,
  userPicture: '',
  userName: '',
  userUid: '',
  isOpenLoginModal: false,
  isOpenLogoutModal: false,
  modalType: 'login',
})

export const mutations = {
  setUserLoggedIn(state, payload) {
    state.isUserLoggedIn = true
    state.userPicture =
      payload.userPicture ||
      'https://fakeimg.pl/350x200/003756/?text=' + state.userName
    state.userName = payload.userName
    state.userUid = payload.userUid

    if (process.client) {
      Cookie.set('id_token', payload.id_token)
      Cookie.set('refresh_token', payload.refresh_token)
      Cookie.set('userUid', state.userUid)
      Cookie.set('userPicture', state.userPicture)
      Cookie.set('userName', state.userName)
    }
  },
  setUserLogout(state, payload) {
    state.isUserLoggedIn = false
    state.userName = ''
    state.userPicture = ''

    if (process.client) {
      // 移除Cookie資訊
      Cookie.remove('id_token')
      Cookie.remove('refresh_token')
      Cookie.remove('userUid')
      Cookie.remove('userPicture')
      Cookie.remove('userName')
    }

    this.$router.push({ name: 'index' })
  },
  setUserName(state, payload) {
    state.userName = payload
  },
  setOpenLoginModal(state, payload) {
    state.isOpenLoginModal = payload
  },
  setOpenLogoutModal(state, payload) {
    state.isOpenLogoutModal = payload
  },
  setModalType(state, payload) {
    state.modalType = payload
  },
}

export const getters = {}

export const actions = {
  nuxtServerInit({ commit, dispatch }, context) {
    // Oauth 回來時提早觸發
    if (context.query.id_token && context.query.refresh_token) {
      const id_token_Decode = jwtDecode(context.query.id_token)
      // console.log(id_token_Decode)

      commit('setUserLoggedIn', {
        userName: id_token_Decode.name,
        userUid: id_token_Decode.user_id,
        userPicture: id_token_Decode.picture,
        id_token: context.query.id_token,
        refresh_token: context.query.refresh_token,
      })

      dispatch('saveMemberInfo', {
        email: id_token_Decode.email,
        name: id_token_Decode.name,
        userUid: id_token_Decode.user_id,
        picture: id_token_Decode.picture,
      })

      // 在後端設定cookie
      context.app.$cookies.set('userName', id_token_Decode.name)
      context.app.$cookies.set('userUid', id_token_Decode.user_id)
      context.app.$cookies.set('userPicture', id_token_Decode.picture)
      context.app.$cookies.set('id_token', context.query.id_token)
      context.app.$cookies.set('refresh_token', context.query.refresh_token)
      return
    }

    // 網頁重整時觸發
    if (context.app.$cookies.get('id_token')) {
      const picture = context.app.$cookies.get('userPicture')
      const name = context.app.$cookies.get('userName')
      const uid = context.app.$cookies.get('userUid')

      commit('setUserLoggedIn', {
        userPicture: picture,
        userName: name,
        userUid: uid,
      })
    }
  },
  saveMemberInfo({ state }, payload) {
    const uid = (payload && payload.userUid) || state.userUid

    return this.$axios({
      method: API.patchMemberInfo.method,
      url: API.patchMemberInfo.url.replace(':user_id.json', uid + '.json'),
      data: {
        ...payload,
      },
    })
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log(res.data, 'patchMemberInfo response')
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error, 'error')
      })
  },
}
