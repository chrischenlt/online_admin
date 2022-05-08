
<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form ref="ruleForm" :model="teacher" :rules="rules" label-width="100px">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="入驻时间" prop="joinDate">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level">
          <!--
            数据类型一定要和ac取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像" prop="avatar">
        <el-upload
          ref="up"
          :file-list="avatarUploadFileList"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :on-change="handlePreview"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/admin/oss/file/upload?module=avatar'"
          :auto-upload="false"
          class="avatar-uploader"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate()"
        >保存
        </el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import teacherApi from '@/api/teacher'

export default {

  data() {
    return {

      isSaveOrUpdate: false, // true代表是新建页面，false代表是编辑页面
      idToUpdate: '',

      // 讲师对象
      avatarUploadFileList: [],
      teacher: {
        sort: 0,
        level: 1,
        avatar: '',
        name: '',
        intro: ''
      },
      saveBtnDisabled: false, // 默认按钮可用
      BASE_API: process.env.BASE_API,
      avatarUrl: '',
      ruleForm: {
        name: '',
        joinDate: '',
        level: '',
        intro: '',
        career: '',
        avatar: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' }
        ]
      }
    }
  },

  // 组件创建时先通过地址栏id确定当前页面类型
  created() {
    const idToUpdate = this.$route.params.id
    if (idToUpdate) {
      // 如果页面是编辑页，需要将地址栏的id存起来，因为地址栏上的东西很容易不见
      this.idToUpdate = idToUpdate

      // 设置页面类型
      this.isSaveOrUpdate = false

      // 从远程拉取正在编辑的讲师的数据
      this.fetchDataById(this.idToUpdate)
    } else {
      this.isSaveOrUpdate = true
    }
  },

  methods: {

    /**
     这个方法挂载在上传组件的on-change钩子上，
     也就是说，用户每次在上传组件中选择了图片，这段代码都会被触发
     this.avatarUploadFileList 存放的是待上传的文件列表
     因为默认是可以上传多张，所以是一个列表
     我们需要在用户每次选择图片的时候，
     都将列表手动限制为只有一张图片
     */
    handlePreview(file) {
      // 清空list
      this.avatarUploadFileList.splice(0, this.avatarUploadFileList.length)

      // 把用户刚刚选的那张图放进来
      this.avatarUploadFileList.push(file)

      console.log('this.avatarUploadFileList = ', this.avatarUploadFileList)
      console.log('from handlePreview(), file = ', file)

      // 读取刚上传的file的内容，放在avatarUrl中
      // （img 组件的图片源绑定了this.avatarUrl）
      this.avatarUrl = URL.createObjectURL(file.raw)
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    /**
     判断用户是否有点击上传过新的头像
     */
    hasUploadNewAvatar() {
      return this.avatarUploadFileList.length !== 0
    },

    saveOrUpdate() {
      this.$refs.ruleForm.validate((valid, field) => {
        const map = {
          'name': '姓名',
          'intro': '简介'
        }
        if (!valid) {
          console.log('invalid field: ', field)
          debugger
          for (const fieldKey in field) {
            this.$message(`您的${map[fieldKey]}字段未填写`)
            break

          }
          // for (const key in this.ruleForm) {
          //   const i = ['name', 'intro'].indexOf(key)
          //   if (i > -1) {
          //     if (!this.ruleForm[i]) {
          //       this.$message.warning(`您的${key}属性未填写完整`)
          //       break;
          //     }
          //   }
          //   debugger
          // }

          //this.$message.error('信息填写不完整，请根据提示完成')
          return false
        }
        this.saveBtnDisabled = true // 控制按钮的状态，成功之后要改回来？
        if (this.isSaveOrUpdate) {
          this.saveData()
        } else {
          this.updateData()
        }
      })
    },

    /**
     * 调用API向数据库保存信息
     * @param {string} type //为save或update
     * @param {Object} teacher 要传的参数
     */
    callTeacherApiByType(type, teacher) {
      let msg = ''
      if (type === 'save') {
        teacherApi.save(teacher).then(response => {
          msg = response.message
          this.$message({
            message: msg,
            type: 'success'
          })
          this.$router.push({ path: '/teacher' })
        })
      } else if (type === 'update') {
        teacherApi.updateById(teacher).then(response => {
          msg = response.message
          this.$message({
            message: msg,
            type: 'success'
          })
          this.$router.push({ path: '/teacher' })
        })
      }
    },

    // 数据保存（新建页）
    /**
     * 两种情况：
     1. 用户有上传头像，先传阿里云，拿到url再写入teacher.avatar，然后传给后台
     2. 用户不上传头像，teacher.avatar传空参给后台
     */
    saveData() {
      /**
       如果用户有点击上传过东西，就把控制权交给头像上传组件，
       上传成功后，接口逻辑在handleAvatarSuccess()里面处理

       如果用户没有点击上传过东西，就直接向后台save接口发送数据
       */
      if (this.hasUploadNewAvatar()) {
        this.$refs.up.submit()
      } else {
        this.teacher.avatar = ''
        this.callTeacherApiByType('save', this.teacher)
        // teacherApi.save(this.teacher).then(response => {
        //   this.$message({
        //     message: response.message,
        //     type: 'success'
        //   })
        //   this.$router.push({ path: '/teacher' })
        // })
      }
    }
    ,

// 数据更新（编辑页）
    updateData() {
      /**
       如果用户有点击上传过东西，就把控制权交给头像上传组件，
       上传成功后，接口逻辑在handleAvatarSuccess()里面处理

       如果用户没有点击上传过东西，就直接向后台save接口发送数据
       */
      if (this.hasUploadNewAvatar()) {
        this.$refs.up.submit()
      } else {
        debugger
        this.callTeacherApiByType('update', this.teacher)
        debugger
        // teacherApi.updateById(this.teacher).then(response => {
        //   this.$message({
        //     message: response.message,
        //     type: 'success'
        //   })
        //   this.$router.push({ path: '/teacher' })
        // })
      }
    }
    ,

// 根据id查询数据
    fetchDataById(id) {
      teacherApi.getById(id).then(response => {
        this.teacher = response.data.item
        this.avatarUrl = this.teacher.avatar
      })
    }
    ,

// 文件上传成功
    /**
     这个方法是上传头像成功的回调函数，
     只会在头像上传成功后被执行
     无论是新建还是编辑，用户只要动过上传框，
     之后的逻辑在这里处理
     */
    handleAvatarSuccess(response, file) {
      if (response.success) {
        this.teacher.avatar = response.data.url
        // 强制重新渲染
        this.$forceUpdate()

        /**
         此处如果上传成功了，需要根据是新建页还是编辑页来决定调用哪个接口，
         这段代码被调用太多次了，我们封装一下
         */
        if (this.isSaveOrUpdate) {
          this.callTeacherApiByType('save', this.teacher)
        } else {
          this.callTeacherApiByType('update', this.teacher)
        }

        // teacherApi.save(this.teacher).then(response => {
        //   // 弹出成功提示
        //   this.$message({
        //     message: response.message,
        //     type: 'success'
        //   })
        //   this.$router.push({ path: '/teacher' })
        // })
      } else {
        this.$message.error('上传失败! （非20000）')
      }
    }
    ,

// 文件上传失败（http）
    handleAvatarError() {
      this.$message.error('上传失败! （http失败）')
    }
    ,

// 文件上传前的校验
    beforeAvatarUpload(file) {
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
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
