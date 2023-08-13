<template>
  <div>
    <Header
      @openLoginModal="openLoginModal"
      @openLogoutModal="openLogoutModal"
    />
    <div class="layout">
      <nuxt />
    </div>
    <MyFooter />
    <LoginModal
      :is-open-modal.sync="isOpenLoginModal"
      :modal-type.sync="modalType"
      :error-msg.sync="errorMsg"
      @loginModalSubmit="loginModalSubmit"
    />

    <LogoutModal :is-open-logout-modal.sync="isOpenLogoutModal" />
  </div>
</template>

<script>
import LoginModal from '@/components/Modal/LoginModal.vue'
import LogoutModal from '@/components/Modal/LogoutModal.vue'
import MyFooter from '@/components/Footer/Footer.vue'
import API from '~/utils/api'
import APIHandler from '~/utils/apiHandler'

export default {
  name: 'Default',
  components: {
    LoginModal,
    LogoutModal,
    MyFooter,
  },
  data() {
    return {
      // isOpenLoginModal: false,
      // isOpenLogoutModal: false,
      // modalType: '',
      errorMsg: '',
    }
  },
  computed: {
    isOpenLoginModal: {
      get() {
        return this.$store.state.isOpenLoginModal
      },
      set(val) {
        this.$store.commit('setOpenLoginModal', val)
      },
    },
    isOpenLogoutModal: {
      get() {
        return this.$store.state.isOpenLogoutModal
      },
      set(val) {
        this.$store.commit('setOpenLogoutModal', val)
      },
    },
    modalType: {
      get() {
        return this.$store.state.modalType
      },
      set(val) {
        this.$store.commit('setModalType', val)
      },
    },
  },
  methods: {
    openLoginModal(val) {
      this.$store.commit('setOpenLoginModal', val)
      this.$store.commit('setModalType', 'login')
      // this.isOpenLoginModal = val
      // this.modalType = 'login'
    },
    openLogoutModal(val) {
      this.$store.commit('setOpenLogoutModal', val)
      this.$store.commit('setModalType', 'logout')
      // this.isOpenLogoutModal = val
      // this.modalType = 'logout'
    },
    loginModalSubmit(data) {
      const { modalType, name, email, password } = data

      if (modalType === 'login') {
        this.$axios({
          method: API.member.login.method,
          url: API.member.login.url,
          baseURL: process.env.GOOGLE_API_URL,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            email,
            password,
            returnSecureToken: true,
          },
        })
          .then((loginRes) => {
            this.getUserName(loginRes)
          })
          .catch((error) => {
            const code = error.response.status
            const errorMsg = error.response.data.error.message
            const errorCH = APIHandler.matchErrorMsg(code, errorMsg)
            this.errorMsg = errorCH
          })
      }
      if (modalType === 'register') {
        this.$axios({
          method: API.member.registered.method,
          url: API.member.registered.url,
          baseURL: process.env.GOOGLE_API_URL,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            email,
            password,
            returnSecureToken: true,
          },
        })
          .then((res) => {
            // 將memberInfo 存到firebase
            const _data = { email, name, userUid: res.data.localId }
            this.$store.dispatch('saveMemberInfo', _data)
            this.$store.commit('setOpenLoginModal', false)
            // this.isOpenLoginModal = false
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
          })
      }
    },
    getUserName(loginRes) {
      this.$axios({
        method: API.getMemberInfo.method,
        url: API.getMemberInfo.url.replace(
          ':user_id.json',
          loginRes.data.localId + '.json'
        ),
      })
        .then((usersRes) => {
          this.$store.commit('setUserName', usersRes.data.name)

          const _data = {
            userName: usersRes.data.name,
            userUid: loginRes.data.localId,
            id_token: loginRes.data.idToken,
            refresh_token: loginRes.data.refreshToken,
          }
          this.$store.commit('setUserLoggedIn', _data)
          this.$store.commit('setOpenLoginModal', false)
          // this.isOpenLoginModal = false
        })
        .catch((error) => {
          const code = error.response.status
          const errorMsg = error.response.data.error
          const errorCH = APIHandler.matchErrorMsg(code, errorMsg)
          this.errorMsg = errorCH
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.layout {
  margin-top: 100px;
  min-height: calc(100vh - 164px);
}
</style>
