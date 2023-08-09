<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <div>
      <p>statusCode: {{ error.statusCode }}</p>
      <p>errorMessage: {{ error.message }}</p>
    </div>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  //   layout: "error", // you can set a custom layout for the error page
}
</script>
