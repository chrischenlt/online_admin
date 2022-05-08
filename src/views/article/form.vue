<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新文章</h2>

    <el-form label-width="120px">

      <el-form-item label="文章标题">
        <el-input v-model="articleInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="文章简介">
        <el-input v-model="articleInfo.introduce" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="文章内容">
        <tinymce :height="300" v-model="articleInfo.articleContent"/>
      </el-form-item>

      <el-form-item label="文章封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API + '/admin/oss/file/upload?module=cover'"
          class="cover-uploader">
          <img v-if="articleInfo.cover" :src="articleInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/article'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 按钮是否禁用
      articleInfo: {
        title: '',
        introduce: '',
        cover: '',
        articleContent: ''
      },
      BASE_API: process.env.BASE_API
    }
  },

  created() {
    const url = window.location.href
    const last = url.split('/')[url.split('/').length - 1]
    if (last !== 'info') {
      this.fetchCourseInfoById(last)
    }
  },

  methods: {

    fetchCourseInfoById(id) {
      articleApi.getArticleInfoById(id).then(response => {
        this.articleInfo = response.data.item
      })
    },

    saveOrUpdate() {
      const url = window.location.href
      const last = url.split('/')[url.split('/').length - 1]
      this.saveBtnDisabled = true
      if (last === 'info') {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    saveData() {
      articleApi.saveArticleInfo(this.articleInfo).then(response => {
        this.$message.success(response.message)
      })
    },

    updateData() {
      articleApi.updateArticleInfoById(this.articleInfo).then(response => {
        this.$message.success(response.message)
      })
    },

    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.articleInfo.cover = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1（非20000）')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg' // MIME
      const isPNG = file.type === 'image/png' // MIME
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败（http错误）')
    }
  }
}
</script>

<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}

.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}

.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
