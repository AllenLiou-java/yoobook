<template>
  <transition name="zoom">
    <div
      v-if="isOpen"
      id="book"
      :class="{ 'has-mouse': hasMouse }"
      :style="{ top: positionY + 'px' }"
      @touchstart="hasMouse = false"
    >
      <client-only>
        <Flipbook
          v-slot="flipbook"
          ref="flipbook"
          class="flipbook"
          :pages="pagesContent.pages"
          :start-page="pageNum"
          @flip-left-start="onFlipLeftStart"
          @flip-left-end="onFlipLeftEnd"
          @flip-right-start="onFlipRightStart"
          @flip-right-end="onFlipRightEnd"
          @zoom-start="onZoomStart"
          @zoom-end="onZoomEnd"
        >
          <div class="action-bar">
            <left-icon
              class="btn"
              :class="{ disabled: !flipbook.canFlipLeft }"
              @click="flipbook.flipLeft"
            />
            <plus-icon
              class="btn"
              :class="{ disabled: !flipbook.canZoomIn }"
              @click="flipbook.zoomIn"
            />
            <span class="page-num">
              Page {{ flipbook.page }} of {{ flipbook.numPages }}
            </span>
            <minus-icon
              class="btn"
              :class="{ disabled: !flipbook.canZoomOut }"
              @click="flipbook.zoomOut"
            />
            <right-icon
              class="btn"
              :class="{ disabled: !flipbook.canFlipRight }"
              @click="flipbook.flipRight"
            />
            <close-icon class="btn close" @click="closeViewer" />
          </div>
        </Flipbook>
      </client-only>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
    },
    pagesContent: {
      type: Object,
      default() {
        return {
          name: '',
          activePage: 1,
          coverImg: '',
          pages: [],
        }
      },
    },
    positionY: {
      type: Number,
      default() {
        return 0
      },
    },
  },
  data() {
    return {
      // pages: [],
      // pagesHiRes: [],
      hasMouse: true,
      pageNum: this.pagesContent.activePage,
    }
  },
  watch: {
    isOpen(newVal, oldVal) {
      if (newVal) {
        window.location.hash = `book/${this.pagesContent.name}/`
        this.pageNum = this.pagesContent.activePage
      } else {
        window.location.hash = ''
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', (ev) => {
      const flipbook = this.$refs.flipbook
      if (!flipbook) return
      // eslint-disable-next-line eqeqeq
      if (ev.keyCode == 37 && flipbook.canFlipLeft) flipbook.flipLeft()
      // eslint-disable-next-line eqeqeq
      if (ev.keyCode == 39 && flipbook.canFlipRight) flipbook.flipRight()
    })

    window.addEventListener('hashchange', this.setPageFromHash)
    this.setPageFromHash()
  },
  methods: {
    onFlipLeftStart(page) {
      // eslint-disable-next-line no-console
      console.log('flip-left-start', page)
    },
    onFlipLeftEnd(page) {
      // eslint-disable-next-line no-console
      console.log('flip-left-end', page)
      window.location.hash = `book/${this.pagesContent.name}/` + page
    },
    onFlipRightStart(page) {
      // eslint-disable-next-line no-console
      console.log('flip-right-start', page)
    },
    onFlipRightEnd(page) {
      // eslint-disable-next-line no-console
      console.log('flip-right-end', page)
      window.location.hash = `book/${this.pagesContent.name}/` + page
    },
    onZoomStart(zoom) {
      // eslint-disable-next-line no-console
      console.log('zoom-start', zoom)
    },
    onZoomEnd(zoom) {
      // eslint-disable-next-line no-console
      console.log('zoom-end', zoom)
    },
    setPageFromHash() {
      const n = parseInt(window.location.hash.split('/')[2], 10)
      if (isFinite(n)) this.pageNum = n
    },
    closeViewer() {
      this.$emit('closeViewer', !this.isOpen)
    },
  },
}
</script>

<style lang="scss">
@import './book.scss';
</style>
