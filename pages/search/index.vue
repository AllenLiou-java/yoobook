<template>
  <div class="search container">
    <template v-if="isOpen">
      <!-- <SimpleTable /> -->
      <CompleteTable />
    </template>
    <template v-else>
      <p class="tip">目前尚未開放查詢喔!</p>
    </template>
  </div>
</template>

<script>
// import SimpleTable from '@/components/Table/SimpleTable.vue'
import CompleteTable from '@/components/Table/CompleteTable.vue'
export default {
  components: {
    // SimpleTable,
    CompleteTable,
  },
  data() {
    return {
      isOpen: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import './search.scss';
</style>
