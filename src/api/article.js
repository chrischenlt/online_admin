import request from '@/utils/request'

export default {
  saveArticleInfo(articleInfo) {
    return request({
      url: '/admin/edu/article/save-article-info',
      method: 'post',
      data: articleInfo
    })
  },

  getArticleInfoById(id) {
    return request({
      url: `/admin/edu/article/article-info/${id}`,
      method: 'get'
    })
  },

  updateArticleInfoById(articleInfo) {
    return request({
      url: '/admin/edu/article/update-article-info',
      method: 'put',
      data: articleInfo
    })
  },

  getPageList(page, limit) {
    return request({
      url: `/admin/edu/article/list/${page}/${limit}`,
      method: 'get'
    })
  },

  removeById(id) {
    return request({
      url: `/admin/edu/article/remove/${id}`,
      method: 'delete'
    })
  }
}
