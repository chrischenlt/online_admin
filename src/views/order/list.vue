<template>
  <div class="app-container">

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">

      <el-table-column type="selection"/>

      <el-table-column
        label="#"
        width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户名称" width="80"/>
      <el-table-column prop="status" label="支付状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">未支付</el-tag>
          <el-tag v-if="scope.row.status === 1">已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="courseTitle" label="课程名称"/>
      <!--      <el-table-column prop="sort" label="排序" width="60"/>-->
      <el-table-column prop="gmtCreate" label="下单时间" width="160"/>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      style="padding: 30px 0; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"/>
  </div>
</template>

<script>
import orderApi from '@/api/order'

export default {

  data() {
    return {
      list: [], // 订单列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10 // 每页记录数
    }
  },

  created() {
    this.fetchData()
  },

  methods: {

    // 调用api模块，加载订单列表
    fetchData() {
      orderApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },

    // 改编页码
    changeCurrentPage(page) {
      console.log('changeCurrentPage:' + page)
      this.page = page
      this.fetchData()
    },

    // 改变每页记录数
    changePageSize(size) {
      console.log('changePageSize:' + size)
      this.limit = size
      this.fetchData()
    },

    // 当表格中多选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    }
  }
}
</script>
