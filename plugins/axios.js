/* eslint-disable no-console */
export default function ({ $axios, redirect }) {
  $axios.setBaseURL(process.env.api_url)

  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)

    config.params = {
      key: process.env.firebaseApiKey,
    }
    // console.log(config)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log(error.response)
    if (code === 400) {
      // redirect("/400")
      console.log('error', code)
    }
  })
}
