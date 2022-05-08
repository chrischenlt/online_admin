import request from '@/utils/request'

export default{

  pageList(page, limit, searchObj) {
    return request({
      url: `/api/trade/order/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  }
}
