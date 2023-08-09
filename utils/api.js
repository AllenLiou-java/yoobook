const API = {
  member: {
    // 會員登入 with email / password
    login: {
      url: '/v1/accounts:signInWithPassword',
      method: 'post',
    },
    // 會員註冊 with email / password
    registered: {
      url: '/v1/accounts:signUp',
      method: 'post',
    },
    // 使用 refresh token 換取 ID token
    exchangeToken: {
      url: '/v1/token',
      method: 'post',
    },
  },
  // 取得會員資料
  getMemberInfo: {
    url: '/users/:user_id.json',
    method: 'get',
  },
  // 新增/編輯會員資料
  patchMemberInfo: {
    url: '/users/:user_id.json',
    method: 'patch',
  },
  getOrderInfo: {
    url: '/order/:user_id.json',
    method: 'get',
  },
  patchOrderInfo: {
    url: '/order/:user_id/:order_id.json',
    method: 'patch',
  },
}

module.exports = API
