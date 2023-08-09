<template>
  <div class="search container">
    <SimpleTable />
  </div>
</template>

<script>
import SimpleTable from '@/components/Table/SimpleTable.vue'
export default {
  components: {
    SimpleTable,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
@import './search.scss';
</style>
