<template>
  <div class="header">
    <div class="container">
      <nuxt-link to="/">
        <h1 class="logo">YoooBook</h1>
      </nuxt-link>

      <div class="toggle" @click="toggleNavbar"></div>

      <ul class="navigation">
        <li @click="moveToTop()">
          <nuxt-link to="/">首頁</nuxt-link>
        </li>
        <!-- <li @click="moveToAboutBook()">
            <nuxt-link to="/#about_book">書籍介紹</nuxt-link>
          </li> -->
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
// import { getPosition, lockScroll } from '@/assets/js/tool'

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',

  data() {
    return {
      // 上限(不含)
      breakpointUpperLimit: {
        lg: 1440,
        md: 1200,
        ms: 768,
      },
    }
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
    // this.linkReset()
    window.addEventListener('scroll', () => {
      this.toggleHeader()
      // this.toggleLink()
    })
  },
  methods: {
    toggleHeader() {
      const header = document.querySelector('.header')
      header.classList.toggle('sticky', window.scrollY > 0)
    },
    // toggleLink() {
    //   const clientWidth = document.body.clientWidth
    //   if (clientWidth >= this.breakpointUpperLimit.ms) {
    //     this.setIndexLinkActive(1400)
    //   }
    // },
    // setIndexLinkActive(clientWidth) {
    //   const links = document.querySelectorAll('.navigation > li > a')

    //   links.forEach((link) => {
    //     link.classList.remove('nuxt-link-active', 'nuxt-link-exact-active')
    //   })

    //   links[0].classList.toggle(
    //     'nuxt-link-exact-active',
    //     window.scrollY < clientWidth
    //   )

    //   links[1].classList.toggle(
    //     'nuxt-link-exact-active',
    //     window.scrollY >= clientWidth
    //   )
    // },
    // linkReset() {
    //   this.$router.push('/')
    //   this.moveToTop()
    // },
    moveToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    // moveToAboutBook() {
    //   const aboutBook = document.querySelector('.about_book')
    //   const position = getPosition(aboutBook)

    //   window.scrollTo({
    //     top: position.y,
    //     behavior: 'smooth',
    //   })
    // },
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
