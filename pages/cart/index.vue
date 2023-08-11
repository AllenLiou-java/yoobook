<template>
  <div class="cart">
    <div class="container">
      <section class="order">
        <h2>訂單內容</h2>
        <template v-if="orderList.length > 0">
          <ul class="orderList">
            <li
              v-for="(item, idx) in orderList"
              :key="idx + 1"
              class="orderList__item"
            >
              <img :src="item.imgSrc" alt="books_photo" />
              <div class="right">
                <div class="title">
                  <h3>{{ item.name }}</h3>
                  <ul>
                    <li
                      v-for="(contentItem, c_idx) in item.content"
                      :key="c_idx + 1"
                    >
                      <p>{{ contentItem }}</p>
                    </li>
                  </ul>
                </div>
                <p class="price">
                  NT ${{ item.originalPrice * item.discount * item.qty }}
                </p>
                <p class="qty">{{ item.qty }} 件</p>
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul class="orderList">
            <li class="emptyMsg">購物車內無任何商品，請返回訂購頁</li>
          </ul>
        </template>

        <p class="total">
          小計<span>NT$ {{ totalPrice }}</span>
        </p>
        <div class="clearfix"></div>
      </section>

      <section class="buyerInfo">
        <h2>訂購人資訊</h2>
        <OrderFrom
          :input-setup="inputSetup"
          :btn-setup="btnSetup"
          :form-data="inputValue"
          @submitEvent="sendOrder"
          @resetEvent="beforePath"
        />
      </section>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import API from '~/utils/api'
import OrderFrom from '@/components/Form/OrderForm.vue'

export default {
  components: {
    OrderFrom,
  },
  layout: 'cartPage',
  data() {
    return {
      orderList: [],
      orderInfo: {
        buyer: '',
        receiver: {
          name: '',
          address: '',
        },
        email: '',
        phone: '',
        taxId: '',
        backAccountNo: '',
        orderId: '',
        orderList: [
          {
            productId: '',
            qty: null,
          },
        ],
        totalPrice: null,
      },
      inputSetup: [
        {
          title: '買受人',
          type: 'text',
          placeholder: '請輸入姓名',
          attrName: 'buyer',
          required: true,
          invalidFeedback: '請輸入買受人姓名',
        },
        {
          title: '收件人姓名',
          type: 'text',
          placeholder: '請輸入姓名',
          attrName: 'recipient',
          required: true,
          invalidFeedback: '請輸入收件人姓名',
        },
        {
          title: '收件人地址',
          type: 'text',
          placeholder: '請輸入地址',
          attrName: 'address',
          required: true,
          invalidFeedback: '請輸入地址',
        },
        {
          title: 'Email',
          type: 'email',
          placeholder: 'example@gmail.com',
          attrName: 'email',
          required: true,
          invalidFeedback: '請確認email格式',
        },
        {
          title: '聯絡電話',
          type: 'tel',
          placeholder: '請輸入電話號碼',
          attrName: 'phone',
          required: true,
          invalidFeedback: '請輸入電話號碼',
        },
        {
          title: '統一編號',
          type: 'text',
          placeholder: '請輸入統一編號',
          attrName: 'taxId',
          required: false,
          invalidFeedback: '請輸入8碼統一編號',
        },
        {
          title: '帳戶後5碼',
          type: 'text',
          placeholder: '請輸入金融帳戶後5碼',
          attrName: 'account',
          required: true,
          invalidFeedback: '請確認輸入之數字',
        },
      ],
      btnSetup: [
        { type: 'reset', btnName: '返回', variant: 'primary' },
        { type: 'submit', btnName: '訂單送出', variant: 'secondary' },
      ],
      inputValue: {
        buyer: '',
        recipient: '',
        address: '',
        email: '',
        phone: '',
        taxId: '',
        account: '',
      },
    }
  },
  computed: {
    totalPrice() {
      if (this.orderList.length > 0) {
        const priceList = this.orderList.map(
          (item) => item.originalPrice * item.discount * item.qty
        )
        const reducePrice = priceList.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })

        return reducePrice
      } else {
        return 0
      }
    },
  },
  mounted() {
    if (Cookie.get('orderListInCart')) {
      this.orderList = JSON.parse(Cookie.get('orderListInCart'))
    }

    this.orderIdCreater()
  },
  methods: {
    sendOrder(buyerInfo) {
      if (this.orderList.length === 0) return

      const orderId = this.orderIdCreater()
      const oderDate = this.oderDateCreater()

      const orderList = this.orderList.map((item) => {
        return {
          productId: item.productId,
          productName: item.name,
          qty: item.qty,
        }
      })

      // 更新要送出的資料
      this.orderInfo.buyer = buyerInfo.buyer
      this.orderInfo.receiver.name = buyerInfo.recipient
      this.orderInfo.receiver.address = buyerInfo.address
      this.orderInfo.email = buyerInfo.email
      this.orderInfo.phone = buyerInfo.phone
      this.orderInfo.taxId = buyerInfo.taxId
      this.orderInfo.backAccountNo = buyerInfo.account
      this.orderInfo.orderId = orderId
      this.orderInfo.orderList = orderList
      this.orderInfo.totalPrice = this.totalPrice
      this.orderInfo.oderDate = oderDate

      const uid = this.$store.state.userUid
      const _this = this

      this.$axios({
        method: API.patchOrderInfo.method,
        url: API.patchOrderInfo.url.replace(
          ':user_id/:order_id.json',
          uid + '/' + orderId + '.json'
        ),
        data: this.orderInfo,
      }).then(function (res) {
        // 清除Cookie
        Cookie.remove('orderListInCart')
        _this.$router.push('/cart/success')
      })
    },
    beforePath() {
      this.$router.back()
    },
    setTimeDateFmt(s) {
      return s < 10 ? '0' + s : s
    },
    oderDateCreater() {
      const now = new Date()
      const _year = now.getFullYear()
      let _month = now.getMonth() + 1
      let _day = now.getDate()
      let _hour = now.getHours()
      let _minutes = now.getMinutes()

      _month = this.setTimeDateFmt(_month)
      _day = this.setTimeDateFmt(_day)
      _hour = this.setTimeDateFmt(_hour)
      _minutes = this.setTimeDateFmt(_minutes)

      const orderDate = `${_year.toString()}/${_month.toString()}/${_day} ${_hour}:${_minutes}`
      return orderDate
    },
    orderIdCreater() {
      const now = new Date()
      const _year = now.getFullYear()
      let _month = now.getMonth() + 1
      let _day = now.getDate()
      let _hour = now.getHours()
      let _minutes = now.getMinutes()
      let _seconds = now.getSeconds()

      _month = this.setTimeDateFmt(_month)
      _day = this.setTimeDateFmt(_day)
      _hour = this.setTimeDateFmt(_hour)
      _minutes = this.setTimeDateFmt(_minutes)
      _seconds = this.setTimeDateFmt(_seconds)
      const orderCode =
        _year.toString() +
        _month.toString() +
        _day +
        _hour +
        _minutes +
        _seconds +
        Math.round(Math.random() * 1000000).toString()

      return orderCode
    },
  },
}
</script>

<style lang="scss" scoped>
@import './cart.scss';
</style>
