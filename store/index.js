/* eslint-disable camelcase */
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'
import API from '~/utils/api'

export const state = () => ({
  isUserLoggedIn: false,
  userPicture: '',
  userName: '',
  userUid: '',
  userEmail: '',
  emailVerified: false,
  isOpenLoginModal: false,
  isOpenLogoutModal: false,
  modalType: 'login',
})

export const mutations = {
  setUserLoggedIn(state, payload) {
    state.isUserLoggedIn = true
    state.userPicture =
      payload.userPicture ||
      'https://fakeimg.pl/100x100/5c6bc0/fff/?text=' + state.userName
    state.userName = payload.userName
    state.userUid = payload.userUid
    state.userEmail = payload.email
    state.emailVerified = payload.emailVerified

    if (process.client) {
      Cookie.set('userName', payload.userName)
      Cookie.set('emailVerified', payload.emailVerified)
      Cookie.set('userUid', payload.userUid)
      Cookie.set('id_token', payload.id_token)
      Cookie.set('refresh_token', payload.refresh_token)
      Cookie.set('email', payload.email)
      Cookie.set('userPicture', state.userPicture)
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
      Cookie.remove('email')
      Cookie.remove('emailVerified')
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
  setEmailVerified(state, payload) {
    state.emailVerified = payload
  },
}

export const getters = {}

export const actions = {
  nuxtServerInit({ commit, dispatch }, context) {
    // Oauth 回來時提早觸發
    if (context.query.id_token && context.query.refresh_token) {
      const id_token_Decode = jwtDecode(context.query.id_token)

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
  saveMemberInfo({ state, commit }, payload) {
    const uid = (payload && payload.userUid) || state.userUid

    return this.$axios({
      method: API.patchMemberInfo.method,
      url: API.patchMemberInfo.url.replace(':user_id.json', uid + '.json'),
      data: {
        ...payload,
      },
    })
      .then((res) => {
        commit('setOpenLoginModal', false)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error, 'error')
      })
  },
  emailVerify(context, payload) {
    return this.$axios({
      baseURL: process.env.GOOGLE_API_URL,
      method: API.member.emailVerify.method,
      url: API.member.emailVerify.url,
      data: { requestType: 'VERIFY_EMAIL', idToken: payload },
    })
  },
}
