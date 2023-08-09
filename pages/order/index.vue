<template>
  <div class="purchase">
    <div class="container">
      <img class="purchase__img" :src="productInfo.imgSrc" alt="books_photo" />
      <div class="purchase__info">
        <h3>{{ productInfo.name }}</h3>
        <ul class="book">
          <li
            v-for="(item, idx) in productInfo.content"
            :key="idx"
            class="book__item"
          >
            {{ item }}
          </li>
        </ul>
        <div class="price">
          <p>
            定價：<del>{{ productInfo.originalPrice }}</del
            >元
          </p>
          <p class="discount_price">
            優惠價：{{ productInfo.originalPrice * productInfo.discount }} 元
          </p>
          <div class="clearfix"></div>
        </div>

        <client-only>
          <div class="form">
            <label for="orderQty">數量：</label>
            <minus class="minus" @click="minusQty" />
            <input
              id="orderQty"
              v-model.number="productInfo.qty"
              type="text"
              @change="confirmVal"
            />
            <plus class="plus" @click="addQty" />
          </div>
        </client-only>

        <a class="button" @click.prevent="toCheckout">直接購買</a>
      </div>
    </div>
    <div class="order_description container">
      <div class="line"></div>
      <p class="title">【 購物說明 】</p>
      <p>
        若您具有法人身份為常態性且大量購書者，或有特殊作業需求，建議您可洽詢「企業採購」。
      </p>
      <p class="title">【 退換貨說明 】</p>
      <p>
        會員所購買的商品均享有到貨十天的猶豫期（含例假日）。退回之商品必須於猶豫期內寄回。
      </p>
      <p>
        辦理退換貨時，商品必須是全新狀態與完整包裝(請注意保持商品本體、配件、贈品、保證書、
        原廠包裝及所有附隨文件或資料的完整性，切勿缺漏任何配件或損毀原廠外盒)。
      </p>
      <p>退回商品無法 回復原狀者，恐將影響退貨權益或需負擔部分費用。</p>
      <p>訂購本商品前請務必詳閱商品退換貨原則。</p>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import { lockScroll } from '@/assets/js/tool'

export default {
  data() {
    return {
      productInfo: {
        productId: 'AA000001',
        name: '公司登記實務及案例解析(共三冊)',
        content: ['有限公司篇', '股份有限公司篇', '應備文件詳析篇'],
        originalPrice: 5500,
        discount: 5000 / 5500,
        qty: 1,
        imgSrc: require('@/assets/img/books.png'),
      },
    }
  },
  methods: {
    toCheckout() {
      if (this.openModal()) return

      if (this.productInfo.qty > 0) {
        if (process.client) {
          const orderListInCart = Cookie.get('orderListInCart')

          // 確認Cookie中是否有 orderListInCart 資料
          if (orderListInCart) {
            const _this = this
            // 確認item是否在購物車有紀錄
            const arrOrderListInCart = JSON.parse(Cookie.get('orderListInCart'))
            const dataIdx = arrOrderListInCart.findIndex(function (item) {
              return item.productId === _this.productInfo.productId
            })

            // 已加入購物車 -> 修改該筆資料
            // 未加入購物車 -> 新增該筆資料
            if (dataIdx >= 0) {
              arrOrderListInCart[dataIdx] = _this.productInfo
            } else {
              arrOrderListInCart.push(_this.productInfo)
            }

            // 存入Cookie
            const strOrderList = JSON.stringify(arrOrderListInCart)
            Cookie.set('orderListInCart', strOrderList)
          } else {
            const orderList = []
            orderList.push(this.productInfo)
            const strOrderList = JSON.stringify(orderList)
            Cookie.set('orderListInCart', strOrderList)
          }
        }

        this.$router.push('/cart')
      }
    },
    minusQty() {
      if (this.productInfo.qty > 1) {
        this.productInfo.qty--
      }
    },
    addQty() {
      this.productInfo.qty++
    },
    confirmVal() {
      if (typeof this.productInfo.qty === 'string' || this.qty <= 0) {
        this.productInfo.qty = 1
      }
    },
    openModal() {
      const uid = Cookie.get('userUid')
      if (!uid) {
        // 開啟loginmodal
        this.$store.commit('setOpenLoginModal', true)
        lockScroll()
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './order.scss';
</style>
