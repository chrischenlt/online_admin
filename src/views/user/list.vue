<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table :data="list" border stripe >

      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="用户头像" width="180" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="scope.row.title" width="60px" height="60px">
        </template>
      </el-table-column>
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <p>
            {{ scope.row.nickname }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="320">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否禁用" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDisabled === true ? 'warning' : 'success'">{{ scope.row.isDisabled === true ? '已禁用' : '已启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="enable(scope.row.id)">启用</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="forbidden(scope.row.id)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import userApi from '@/api/user'

export default {

  data() {
    return {
      list: [], // 用户列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10 // 每页记录数
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      userApi.getPageList(this.page, this.limit).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 根据id禁用用户
    forbidden(userId) {
      this.$confirm('是否禁用用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return userApi.forbidden(userId)
      }).then(response => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message.info('取消禁用')
        }
      })
    },

    // 根据id禁用用户
    enable(userId) {
      this.$confirm('是否启用用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return userApi.enable(userId)
      }).then(response => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message.info('取消启用')
        }
      })
    }
  }
}
</script>
