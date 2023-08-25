<template>
  <div class="header">
    <div class="container">
      <nuxt-link to="/">
        <h1 class="logo">Yooooobook</h1>
      </nuxt-link>

      <div class="toggle" @click="toggleNavbar"></div>

      <ul class="navigation">
        <li @click="moveToTop()">
          <nuxt-link to="/">首頁</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/order">預購書籍</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search">訂單查詢</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/file">檔案下載</nuxt-link>
        </li>
        <li v-if="eventType.event_en === 'login'">
          <button class="btnLogin-popup" @click="openModal(eventType.event_en)">
            {{ eventType.event_ch }}
          </button>
        </li>
        <li v-if="eventType.event_en === 'logout'">
          <button
            class="btnLogout-popup"
            @click="openModal(eventType.event_en)"
          >
            {{ eventType.event_ch }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { lockScroll } from '@/assets/js/tool'

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',

  data() {
    return {}
  },
  computed: {
    eventType() {
      const isUserLoggedIn = this.$store.state.isUserLoggedIn
      if (isUserLoggedIn) {
        return {
          event_ch: '登出',
          event_en: 'logout',
        }
      } else {
        return {
          event_ch: '登入',
          event_en: 'login',
        }
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.toggleHeader()
    })
  },
  methods: {
    toggleHeader() {
      const header = document.querySelector('.header')
      header.classList.toggle('sticky', window.scrollY > 0)
    },
    moveToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    toggleNavbar() {
      const toggle = document.querySelector('.toggle')
      const navigation = document.querySelector('.navigation')

      toggle.classList.toggle('active')
      navigation.classList.toggle('active')

      this.closeToggle()
    },
    closeToggle() {
      const activeItem = document.querySelectorAll('.navigation.active li')
      const toggle = document.querySelector('.toggle')
      const navigation = document.querySelector('.navigation')

      activeItem.forEach((item) => {
        item.addEventListener('click', () => {
          toggle.classList.remove('active')
          navigation.classList.remove('active')
        })
      })
    },
    openModal(event) {
      if (event === 'login') {
        this.$emit('openLoginModal', true)
      } else {
        this.$emit('openLogoutModal', true)
      }

      lockScroll()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './header.scss';
</style>
