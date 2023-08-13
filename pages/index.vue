<template>
  <div>
    <BannerContent class="banner" />
    <section class="book_knowledge container">
      <h2>What Will You Learn?</h2>
      <ul>
        <li>公司有能力自己辦理公司登記</li>
        <li>提升專業知識，協助客戶辦理公司登記</li>
        <li>塑造自身專業形象，讓客戶願意花更多錢委託代辦</li>
        <li>建立口碑，讓更多公司成為你的客戶</li>
      </ul>
    </section>

    <section class="book_features">
      <div class="cards container">
        <Card
          v-for="(feature, index) in features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
        />
      </div>

      <CardSwiper class="card_swiper" :features="features" />

      <div id="about_book" class="about_book">
        <div class="wrapper">
          <h3 class="title">
            <span>本</span>
            <span>書</span>
            <span>簡</span>
            <span>介</span>
          </h3>

          <div class="content">
            <p>
              做為創業者開了家公司，但不知道公司登記相關流程及申請手續嗎?<br />又或者不清楚公司哪些變更是需要向公司登記機關提出申請，<br />結果沒有在期限內申請而被裁罰嗎?
            </p>
            <br /><br />
            <p>
              又或是知道要申請變更登記，但不知道應該準備什麼文件，<br />以及文件有哪些地方是需要注意、哪些程序是需要踐行，<br />導致一直遲遲無法取得登記核准文件嗎?
            </p>
            <br /><br />
            <p>
              做為提供公司登記服務的從業人員，<br />明明依照相關規定檢附文件，<br />但還是常常被公司登記機關通知補正，<br />結果自己卻還是不知道哪裡錯，<br />導致案件延宕甚至被退件，<br />最後沒有在客戶要求的時間內完成，<br />不僅重創己身的專業形象，更可能因此失去了重要的客戶。
            </p>
            <br /><br />
            <p>現在，只要擁有這一本，就可以搞定公司登記!</p>
          </div>
        </div>
      </div>
    </section>
    <section class="book_preview">
      <div class="book_wrapper container">
        <div class="books">
          <div
            v-for="(book, i) in books"
            :key="i"
            :class="['book', 'book' + Number(i + 1)]"
            @click="openViewer(i)"
          >
            <div class="bookName">{{ book.name_zh }}</div>

            <img :src="book.coverImg" alt="book-cover" />

            <div class="bookshelf mobile">
              <img src="~/assets/img/bookshelf.png" alt="bookshelf" />
            </div>

            <p class="tip_info mobile">↑點擊書籍進入預覽模式</p>
          </div>
        </div>
        <div class="bookshelf">
          <img src="~/assets/img/bookshelf.png" alt="bookshelf" />
        </div>

        <p class="tip_info">↑點擊書籍進入預覽模式</p>
      </div>

      <BookReader
        :is-open="isOpen"
        :pages-content="selectedBook"
        class="book_viewer"
        :position-y="bookPositionY"
        @closeViewer="closeViewer"
      ></BookReader>
    </section>
    <section class="about_customer">
      <h2>Who Should Read This Book</h2>
      <h3>最適合那些讀者群呢?</h3>
      <div class="main_content">
        <img class="books" src="~/assets/img/books.png" alt="books" />
        <div class="reader reader01">
          <img src="~/assets/img/reader01.png" alt="reader" />
          <p>會計師、記帳士、記帳及報稅代理人等公司登記從業人員</p>
        </div>

        <div class="reader reader02">
          <img src="~/assets/img/reader02.png" alt="reader" />

          <p>公司欲自行辦理公司登記者</p>
          <svg
            class="line"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="230px"
            height="50px"
          >
            <polyline
              points="0,35 30,10 224,10"
              style="fill: none; stroke: #003756"
              stroke-width="1"
            />
            <circle
              cx="224"
              cy="10"
              r="3"
              stroke="#003756"
              stroke-width="1"
              fill="#003756"
            />
          </svg>
        </div>

        <div class="reader reader03">
          <img src="~/assets/img/reader03.png" alt="reader" />

          <p>公司登記機關承辦人員</p>
          <svg
            class="line"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="230px"
            height="50px"
          >
            <polyline
              points="0,0 30,45 224,45"
              style="fill: none; stroke: #003756"
              stroke-width="1"
            />
            <circle
              cx="224"
              cy="45"
              r="3"
              stroke="#003756"
              stroke-width="1"
              fill="#003756"
            />
          </svg>
        </div>
      </div>

      <nuxt-link class="button" to="/order">立即訂購</nuxt-link>
    </section>
  </div>
</template>

<script>
import BannerContent from '@/components/Header/BannerContent.vue'
import Card from '@/components/Card/Card.vue'
import BookReader from '@/components/Book/Book.vue'
import CardSwiper from '@/components/Card/CardSwiper.vue'
import { getPosition, lockScroll, unlockScroll } from '@/assets/js/tool'
import pages from '@/assets/js/book'

export default {
  name: 'IndexPage',
  components: {
    BannerContent,
    Card,
    BookReader,
    CardSwiper,
  },
  data() {
    return {
      features: [
        {
          title: '文件完備',
          description:
            '整理公司登記所需要用到的各項文件範例，不用愁沒有參考範本。',
        },
        {
          title: '用詞精準',
          description:
            '範例精準表達各項公司登記應記載事項及相關說明，不用再煩惱不知道文件內容該怎麼呈現。',
        },
        {
          title: '於法有據',
          description:
            '每份文件、登記案件範例皆有補充相關法令函釋並載明其法源依據，使申請書件符合公司法及相關法令所規定之形式要件，不再擔心文件不符遭登記機關否准。',
        },
        {
          title: '範例詳盡',
          description:
            '完整整理從公司的設立到解散登記，以及公司存續 時可能發生的變更登記範例，遇到變更登記時能有所參考。',
        },
        {
          title: '由簡入繁',
          description:
            '從各項登記之基礎點切入，彙整各項登記可能會遇到的問題並加以說明，讓你熟稔各項公司登記後，即使遇到再複雜的變更登記案件，也能輕鬆掌握要點。',
        },
      ],
      isOpen: false,
      bookPositionY: 150,
      books: [
        {
          name: 'book1',
          name_zh: '有限公司篇',
          activePage: 1,
          coverImg: require('@/assets/img/cover_book-1.jpg'),
          pages: pages.book1,
        },
        {
          name: 'book2',
          name_zh: '股份有限公司篇',
          activePage: 1,
          coverImg: require('@/assets/img/cover_book-2.jpg'),
          pages: pages.book2,
        },
        {
          name: 'book3',
          name_zh: '應備文件詳析篇',
          activePage: 1,
          coverImg: require('@/assets/img/cover_book-3.jpg'),
          pages: pages.book3,
        },
      ],
      selectedBook: {
        pages: [],
        pagesHiRes: [],
      },
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    }
  },
  methods: {
    openViewer(bookNo) {
      this.selectedBook = this.books[bookNo]
      this.isOpen = true

      const bookPreview = document.querySelector('.book_preview')
      const bookPreviewPos = getPosition(bookPreview)
      const book1 = document.querySelector('.book.book1')
      const book2 = document.querySelector('.book.book2')
      const book3 = document.querySelector('.book.book3')

      // 取得每一本書的位置(y)
      // 解析度 > 768，book水平排列，位置相同
      // 解析度 < 768，book垂直排列，位置不同
      const booksPos = [
        getPosition(book1),
        getPosition(book2),
        getPosition(book3),
      ]

      // book 彈窗位置(y)
      const positionTop = booksPos[bookNo].y - bookPreviewPos.y - 50
      this.bookPositionY = positionTop

      window.scrollTo({ top: booksPos[bookNo].y })

      lockScroll()
    },
    closeViewer(val) {
      this.isOpen = val
      unlockScroll()
    },
  },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
