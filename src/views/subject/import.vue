<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="信息描述">

        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="defaultExcelTemplate">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-exceed="fileUploadExceed"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          action="http://127.0.0.1:8110/admin/edu/subject/import"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件
          </el-button>
          <el-button
            :disabled="importBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">导入
          </el-button>
        </el-upload>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultExcelTemplate: process.env.OSS_PATH + '/excel/课程分类列表模板.xls',
      importBtnDisabled: false
    }
  },

  methods: {

    // 执行上传
    submitUpload() {
      this.importBtnDisabled = true // 触发后禁用相关按钮
      this.$refs.upload.submit() // 手动执行提交
    },

    fileUploadExceed() {
      this.$message.warning('只能上传一个文件')
    },

    fileUploadSuccess(response) {
      this.importBtnDisabled = false // 触发后禁用相关按钮
      this.$message.success(response.message)
      this.$refs.upload.clearFiles() // 清空文件列表
    },

    fileUploadError(err) {
      this.importBtnDisabled = false // 触发后禁用相关按钮
      this.$message.error(err.message)
      this.$refs.upload.clearFiles() // 清空文件列表
    }
  }
}
</script>
