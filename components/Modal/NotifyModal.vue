<template>
  <div>
    <b-modal
      :ref="refName"
      centered
      no-close-on-backdrop
      hide-header-close
      hide-footer
      :title="title"
    >
      <div class="d-block text-center">
        <p class="my-4">{{ mainContent }}</p>
      </div>
      <b-button class="mt-3" variant="secondary" block @click="hideModal">{{
        btnName
      }}</b-button>
    </b-modal>
  </div>
</template>

<script>
import { unlockScroll } from '@/assets/js/tool'
export default {
  props: {
    refName: {
      type: String,
      default: 'my-modal',
    },
    title: {
      type: String,
      default: 'Modal Component',
    },
    btnName: {
      type: String,
      default: 'Close',
    },
    mainContent: {
      type: String,
      default: 'Default Content',
    },
  },
  methods: {
    showModal() {
      const refName = Object.keys(this.$refs)
      this.$refs[refName].show()
    },
    hideModal() {
      const refName = Object.keys(this.$refs)
      this.$refs[refName].hide()
      unlockScroll()
    },
  },
}
</script>

<style lang="scss" scoped></style>
