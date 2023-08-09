<template>
  <div>
    <cart-header />
    <div class="layout">
      <nuxt />
    </div>
    <my-footer />
  </div>
</template>

<script>
import CartHeader from '~/components/Header/CartHeader.vue'
import MyFooter from '~/components/Footer/Footer.vue'
export default {
  name: 'CartPage',
  components: { CartHeader, MyFooter },
}
</script>

<style lang="scss" scoped>
.layout {
  margin-top: 100px;
  min-height: calc(100vh - 164px);
}
</style>
