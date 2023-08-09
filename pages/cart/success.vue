<template>
  <div class="success container">
    <client-only>
      <check-circle-outline class="success__icon" />
    </client-only>
    <p>預購成功</p>

    <router-link class="btn" to="/">返回首頁</router-link>
  </div>
</template>

<script>
export default {
  layout: 'cartPage',
}
</script>

<style lang="scss" scoped>
@import './success.scss';
</style>
