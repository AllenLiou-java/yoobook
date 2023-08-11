<template>
  <div class="file container">
    <template v-if="isOpen">
      <form @submit.prevent="uploadFile">
        <input type="file" name="file" required @change="fileChange" />
        <input type="submit" value="Upload" />
      </form>

      <p>{{ img }}</p>
    </template>
    <template v-else>
      <p class="tip">尚無附件可供下載!</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'FilePage',
  data() {
    return {
      img: '',
      isOpen: false,
    }
  },
  methods: {
    uploadFile() {
      // console.log('uploadFile')
    },
    fileChange(e) {
      const fileData = e.target.files[0]
      const reader = new FileReader()

      reader.readAsDataURL(fileData)
      reader.addEventListener('load', (event) => {
        this.img = event.target.result
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './file.scss';
</style>
