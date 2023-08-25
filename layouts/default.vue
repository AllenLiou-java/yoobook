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
      ref="loginModal"
      :is-open-modal.sync="isOpenLoginModal"
      :modal-type.sync="modalType"
      :error-msg.sync="errorMsg"
      @loginModalSubmit="loginModalSubmit"
    />

    <LogoutModal
      :is-open-logout-modal.sync="isOpenLogoutModal"
      @verifiedEmail="sendVerifyEmail"
    />
    <NotifyModal
      ref="emailVarifyNote"
      ref-name="emailVarifyNote"
      title="信箱驗證"
      btn-name="關閉"
      :main-content="emailVarifyNote"
    />
    <NotifyModal
      ref="passwordChangeNote"
      ref-name="passwordChangeNote"
      title="密碼變更"
      btn-name="關閉"
      :main-content="passwordChangeNote"
    />
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import LoginModal from '@/components/Modal/LoginModal.vue'
import LogoutModal from '@/components/Modal/LogoutModal.vue'
import NotifyModal from '@/components/Modal/NotifyModal.vue'
import MyFooter from '@/components/Footer/Footer.vue'
import API from '~/utils/api'
import APIHandler from '~/utils/apiHandler'

export default {
  name: 'Default',
  components: {
    LoginModal,
    LogoutModal,
    NotifyModal,
    MyFooter,
  },
  data() {
    return {
      errorMsg: '',
      email: '',
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
    emailVarifyNote() {
      return '請前往' + this.email + '進行Email驗證'
    },
    passwordChangeNote() {
      return '請前往' + this.email + '進行密碼變更'
    },
  },
  mounted() {
    const idToken = Cookie.get('id_token')
    if (idToken) {
      this.updateEmailVerifiedStatus(idToken)
    }
  },
  methods: {
    openLoginModal(val) {
      this.$store.commit('setOpenLoginModal', val)
      this.$store.commit('setModalType', 'login')
    },
    openLogoutModal(val) {
      this.$store.commit('setOpenLogoutModal', val)
      this.$store.commit('setModalType', 'logout')
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
            this.updateEmailVerifiedStatus(loginRes.data.idToken)
            this.updateLoginInfo(loginRes)
            this.$refs.loginModal.formDataReset()
          })
          .catch((error) => {
            this.errorHandler(error)
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
            const _data = {
              email,
              name,
              userUid: res.data.localId,
              emailVerified: false,
            }
            const idToken = res.data.idToken
            this.$store.dispatch('saveMemberInfo', _data)
            this.emailVerify(idToken).then((res) => {
              this.email = res.data.email
              this.$refs.loginModal.formDataReset()
              this.$refs.emailVarifyNote.showModal()
            })
          })
          .catch((error) => {
            this.errorHandler(error)
          })
      }
      if (modalType === 'forgetPassword') {
        this.$axios({
          baseURL: process.env.GOOGLE_API_URL,
          method: API.member.emailVerify.method,
          url: API.member.emailVerify.url,
          data: { requestType: 'PASSWORD_RESET', email },
        })
          .then((res) => {
            this.email = res.data.email
            this.$store.commit('setOpenLoginModal', false)
            this.$refs.loginModal.formDataReset()
            this.$refs.passwordChangeNote.showModal()
          })
          .catch((error) => {
            this.errorHandler(error)
          })
      }
    },
    updateLoginInfo(loginRes) {
      this.getMemberInfo(loginRes.data.localId)
        .then((usersRes) => {
          this.$store.commit('setUserName', usersRes.data.name)

          // 更新emailVerify

          const _data = {
            userName: usersRes.data.name,
            emailVerified: usersRes.data.emailVerified,
            userUid: loginRes.data.localId,
            id_token: loginRes.data.idToken,
            refresh_token: loginRes.data.refreshToken,
            email: loginRes.data.email,
          }
          this.$store.commit('setUserLoggedIn', _data)
          this.$store.commit('setOpenLoginModal', false)
        })
        .catch((error) => {
          this.errorHandler(error)
        })
    },
    updateEmailVerifiedStatus(idToken) {
      const emailVerified = Cookie.get('emailVerified') === 'true'
      if (emailVerified) {
        this.$store.commit('setEmailVerified', emailVerified)
        return
      }

      this.getAccountInfo(idToken).then((res) => {
        const emailVerified = res.data.users[0].emailVerified
        const localId = res.data.users[0].localId
        const postData = {
          emailVerified,
        }
        this.patchMemberInfo(localId, postData).then((res) => {
          Cookie.set('emailVerified', emailVerified)
          this.$store.commit('setEmailVerified', emailVerified)
        })
      })
    },
    sendVerifyEmail() {
      const idToken = Cookie.get('id_token')

      this.emailVerify(idToken).then((res) => {
        this.$store.commit('setOpenLogoutModal', false)
        this.email = res.data.email
        this.$refs.emailVarifyNote.showModal()
      })
    },
    errorHandler(error) {
      const code = error.response.status
      const errorMsg = error.response.data.error
      const errorCH = APIHandler.matchErrorMsg(code, errorMsg)
      this.errorMsg = errorCH
    },
    getMemberInfo(localId) {
      return this.$axios({
        method: API.getMemberInfo.method,
        url: API.getMemberInfo.url.replace(':user_id.json', localId + '.json'),
      })
    },
    patchMemberInfo(localId, data) {
      return this.$axios({
        method: API.patchMemberInfo.method,
        url: API.patchMemberInfo.url.replace(
          ':user_id.json',
          localId + '.json'
        ),
        data,
      })
    },
    emailVerify(idToken) {
      return this.$axios({
        baseURL: process.env.GOOGLE_API_URL,
        method: API.member.emailVerify.method,
        url: API.member.emailVerify.url,
        data: { requestType: 'VERIFY_EMAIL', idToken },
      })
    },
    getAccountInfo(idToken) {
      return this.$axios({
        method: API.member.getAccountInfo.method,
        url: API.member.getAccountInfo.url,
        baseURL: process.env.GOOGLE_API_URL,
        data: {
          idToken,
        },
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
