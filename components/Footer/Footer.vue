<template>
  <div class="footer">
    <ul class="link_list container">
      <li>
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
    </ul>

    <client-only>
      <ul class="company_info container">
        <li><OfficeBuilding /> 有良冊股份有限公司</li>
        <li><Email /> yooooobook@gmail.com</li>
        <li>統一編號：94008568</li>
      </ul>
    </client-only>

    <p>Copyright © 2023 Yooooobook All rights reserved.</p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import './footer.scss';
</style>
