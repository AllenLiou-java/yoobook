const statusDocument = {
  statusList: [
    {
      code: 400,
      error: 'EMAIL_NOT_FOUND',
      errorCH: 'Email 不存在',
    },
    {
      code: 401,
      error: 'Permission denied',
      errorCH: '權限不足',
    },
  ],
  matchErrorMsg(statusCode, statusError) {
    const statusMatched = statusDocument.statusList.filter((status) => {
      return status.code === statusCode && status.error === statusError
    })

    if (statusCode) {
      return statusMatched[0].errorCH
    } else {
      return '待新增錯誤碼'
    }
  },
}

export default statusDocument
