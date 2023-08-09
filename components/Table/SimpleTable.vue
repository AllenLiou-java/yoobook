<template>
  <b-container fluid>
    <!-- Main table element -->
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
    >
      <template #cell(productName)="row">
        <ul class="list-unstyled">
          <li v-for="(item, idx) in row.item.orderList" :key="idx">
            {{ item.productName }}
          </li>
        </ul>
      </template>

      <template #cell(qty)="row">
        <ul class="list-unstyled">
          <li v-for="(item, idx) in row.item.orderList" :key="idx">
            {{ item.qty }}
          </li>
        </ul>
      </template>

      <template #cell(actions)="row">
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- User Interface controls -->
    <b-row>
      <b-col sm="5" md="3" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="5" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          backAccountNo: '12345',
          buyer: 'Allen co.',
          email: 'allen@gmail.com',
          oderDate: '2023/07/31 16:03',
          orderId: '20230731160334488206',
          orderList: [
            {
              productId: 'AA000001',
              productName: '公司登記實務及案例解析(共三冊)',
              qty: 10,
            },
          ],
          phone: '0911123456',
          receiver: {
            address: 'Taichung',
            name: 'Allen Liou',
          },
          taxId: '123456',
          totalPrice: 54000,
        },
        {
          backAccountNo: '12345',
          buyer: 'Allen co.',
          email: 'allen@gmail.com',
          oderDate: '2023/07/30 16:03',
          orderId: '20230731160334488205',
          orderList: [
            {
              productId: 'AA000001',
              productName: '公司登記實務(共三冊)',
              qty: 5,
            },
            {
              productId: 'AA000001',
              productName: '公司登記實務',
              qty: 8,
            },
          ],
          phone: '0911123456',
          receiver: {
            address: 'Taichung',
            name: 'Allen Liou',
          },
          taxId: '123456',
          totalPrice: 54000,
        },
        {
          backAccountNo: '12345',
          buyer: 'Allen co.',
          email: 'allen@gmail.com',
          oderDate: '2023/07/29 16:03',
          orderId: '20230731160334488204',
          orderList: [
            {
              productId: 'AA000001',
              productName: '公司登記案例解析(共三冊)',
              qty: 2,
            },
          ],
          phone: '0911123456',
          receiver: {
            address: 'Taichung',
            name: 'Allen Liou',
          },
          taxId: '123456',
          totalPrice: 54000,
        },
      ],
      fields: [
        {
          key: 'orderId',
          label: '訂單編號',
          class: 'text-center',
        },
        {
          key: 'oderDate',
          label: '訂單日期',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
        },
        {
          key: 'productName',
          label: '產品名稱',
          class: 'text-center',
        },
        {
          key: 'qty',
          label: '訂購量',
          class: 'text-center',
        },
        {
          key: 'totalPrice',
          label: '總金額',
          class: 'text-center',
        },
        { key: 'actions', label: '操作', class: 'text-center' },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      sortBy: '',
      sortDesc: true,
      sortDirection: 'asc',
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
    }
  },
  computed: {},
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
  },
}
</script>
