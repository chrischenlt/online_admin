import request from '@/utils/request'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `/admin/ucenter/member/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  forbidden(userId) {
    return request({
      url: `/admin/ucenter/member/forbidden/user/${userId}`,
      method: 'post'
    })
  },

  enable(userId) {
    return request({
      url: `/admin/ucenter/member/enable/user/${userId}`,
      method: 'post'
    })
  }
}
