/* eslint-disable no-console */
export default function ({ $axios, redirect }) {
  $axios.setBaseURL(process.env.API_URL)

  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)

    config.params = {
      key: process.env.FIREBASE_API_KEY,
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
