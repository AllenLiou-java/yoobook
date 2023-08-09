<template>
  <div class="container content-layout">
    <form @submit.prevent="uploadFile">
      <input type="file" name="file" required @change="fileChange" />
      <input type="submit" value="Upload" />
    </form>

    <p>{{ img }}</p>
  </div>
</template>

<script>
export default {
  name: 'FilePage',
  data() {
    return {
      img: '',
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
.content-layout {
  margin-top: 100px;
  padding-top: 60px;
}
</style>
