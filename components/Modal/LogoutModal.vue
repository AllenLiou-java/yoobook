<template>
  <div>
    <div :class="[isOpenLogoutModal ? 'background_modal' : '']"></div>
    <client-only>
      <div
        ref="wrapper"
        :class="['wrapper', isOpenLogoutModal ? 'active_popup' : '']"
      >
        <span class="icon_close">
          <close @click="closeModal()" />
        </span>

        <div class="form_box logout">
          <h2>登出</h2>

          <form>
            <div class="user_info">
              <div class="img_wrappr">
                <img :src="userPicture" alt="user_photo" />
              </div>

              <p>{{ userName }}</p>
            </div>

            <button type="submit" class="btn btn_login_logout" @click="logout">
              登出
            </button>
          </form>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { unlockScroll } from '@/assets/js/tool'

export default {
  name: 'LogoutModal',
  props: {
    isOpenLogoutModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userName() {
      return this.$store.state.userName
    },
    userPicture() {
      return this.$store.state.userPicture
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:isOpenLogoutModal', false)
      unlockScroll()
    },
    logout() {
      this.$store.commit('setUserLogout')
      this.closeModal()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './logoutModal.scss';
</style>
