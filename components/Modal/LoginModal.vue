<template>
  <div>
    <div :class="[isOpenModal ? 'background_modal' : '']"></div>
    <client-only>
      <div
        ref="wrapper"
        :class="['wrapper', isOpenModal ? 'active_popup' : '']"
      >
        <span class="icon_close">
          <close @click="closeModal()" />
        </span>

        <div v-if="modalType == 'login'" class="form_box login">
          <h2>{{ modalTitle }}</h2>
          <a href="/auth/">
            <button class="btn btn_socialLogin">
              <Google />使用Google帳號{{ modalTitle }}
            </button>
          </a>
          <hr class="login_or" />

          <form @submit="checkForm">
            <div class="input_box">
              <span class="icon">
                <email />
              </span>
              <input ref="emailInput" v-model="email" type="email" />
              <label>Email</label>
              <p v-if="emailWithError" class="errorMsg">請檢查email是否正確</p>
            </div>
            <div class="input_box">
              <span class="icon">
                <lock />
              </span>
              <input ref="passwordInput" v-model="password" type="password" />
              <label>Password</label>
              <p v-if="passwordWithError" class="errorMsg">請輸入password</p>
            </div>
            <!-- <div class="remember_forgot">
							<label><input type="checkbox" />Remember me</label>
							<a href="#">Forgot Password?</a>
						</div> -->
            <p class="errorMsg">{{ errorMsg }}</p>
            <button type="submit" class="btn btn_login_register">
              {{ modalTitle }}
            </button>
            <div class="login_register">
              <p>
                Don't have account?
                <a href="#" class="register_link" @click.prevent="toRegister()"
                  >Register</a
                >
              </p>
            </div>
          </form>
        </div>

        <div v-if="modalType == 'register'" class="form_box register">
          <h2>{{ modalTitle }}</h2>
          <a href="/auth/">
            <button class="btn btn_socialLogin">
              <Google />使用Google帳號{{ modalTitle }}
            </button>
          </a>
          <hr class="login_or" />

          <form @submit="checkForm">
            <div class="input_box">
              <span class="icon">
                <account />
              </span>
              <input ref="usernameInput" v-model="username" type="text" />
              <label>Username</label>
              <p v-if="nameWithError" class="errorMsg">請輸入username</p>
            </div>
            <div class="input_box">
              <span class="icon">
                <email />
              </span>
              <input ref="emailInput" v-model="email" type="email" />
              <label>Email</label>
              <p v-if="emailWithError" class="errorMsg">請檢查email是否正確</p>
            </div>
            <div class="input_box">
              <span class="icon">
                <lock />
              </span>
              <input ref="passwordInput" v-model="password" type="password" />
              <label>Password</label>
              <p v-if="passwordWithError" class="errorMsg">請輸入password</p>
            </div>
            <div class="input_box">
              <span class="icon">
                <lock />
              </span>
              <input
                ref="repeatPasswordInput"
                v-model="repeatPassword"
                type="password"
              />
              <label>Repeat Password</label>
              <p v-if="repeatPasswordWithError" class="errorMsg">
                請檢查Password與Repeat Password是否相同
              </p>
            </div>
            <!-- <div class="remember_forgot">
							<label
								><input type="checkbox" /> agree to the terms &
								conditions</label
							>
						</div> -->
            <button type="submit" class="btn btn_login_register">
              {{ modalTitle }}
            </button>
            <div class="login_register">
              <p>
                Already have an account?
                <a href="#" class="login_link" @click.prevent="toLogin()"
                  >Login</a
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { unlockScroll } from '@/assets/js/tool'

export default {
  name: 'LoginModal',
  props: {
    isOpenModal: {
      type: Boolean,
      default: false,
    },
    modalType: {
      type: String,
      required: true,
    },
    errorMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      username: '',
      emailWithError: null,
      passwordWithError: null,
      nameWithError: null,
      repeatPasswordWithError: null,
    }
  },
  computed: {
    modalTitle() {
      if (this.modalType === 'login') {
        return '登入'
      } else if (this.modalType === 'register') {
        return '註冊'
      } else {
        return '登出'
      }
    },
  },
  watch: {
    email() {
      const input = this.$refs.emailInput
      if (this.email) {
        input.classList.add('active')
      } else {
        input.classList.remove('active')
      }
    },
    password() {
      const input = this.$refs.passwordInput
      if (this.password) {
        input.classList.add('active')
      } else {
        input.classList.remove('active')
      }
    },
    repeatPassword() {
      const input = this.$refs.repeatPasswordInput
      if (this.repeatPassword) {
        input.classList.add('active')
      } else {
        input.classList.remove('active')
      }
    },
    username() {
      const input = this.$refs.usernameInput
      if (this.username) {
        input.classList.add('active')
      } else {
        input.classList.remove('active')
      }
    },
  },
  methods: {
    toRegister() {
      const wrapper = this.$refs.wrapper
      wrapper.classList.add('active')
      this.$emit('update:modalType', 'register')
      this.formDataReset()
    },
    toLogin() {
      const wrapper = this.$refs.wrapper
      wrapper.classList.remove('active')
      this.$emit('update:modalType', 'login')
      this.formDataReset()
    },
    formDataReset() {
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.username = ''
      this.emailWithError = false
      this.passwordWithError = false
      this.nameWithError = false
      this.repeatPasswordWithError = false
      this.$emit('update:errorMsg', '')
    },
    closeModal() {
      this.$emit('update:isOpenModal', false)
      this.$emit('update:modalType', 'login')
      this.formDataReset()
      unlockScroll()
    },
    checkForm(e) {
      e.preventDefault()

      this.emailWithError = false
      this.passwordWithError = false
      this.nameWithError = false
      this.repeatPasswordWithError = false

      const emailRule =
        // eslint-disable-next-line no-useless-escape
        /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

      // 驗證 email、密碼
      if (this.modalType === 'login') {
        if (this.email.search(emailRule) === -1)
          return (this.emailWithError = true)

        if (!this.password) return (this.passwordWithError = true)
      }

      // 驗證 userName、email、密碼
      if (this.modalType === 'register') {
        if (!this.username) return (this.nameWithError = true)
        if (!this.email) return (this.emailWithError = true)
        if (!this.password) return (this.passwordWithError = true)

        if (this.repeatPassword !== this.password) {
          return (this.repeatPasswordWithError = true)
        }
      }

      // 傳送emit事件與data 到default.vue執行login & register
      this.$emit('loginModalSubmit', {
        modalType: this.modalType,
        name: this.username,
        email: this.email,
        password: this.password,
      })

      this.formDataReset()
      unlockScroll()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './loginModal.scss';
</style>
