<template>
<!--  用来弹出选择用户的框 此处的userType只与tocoder的标签里的usertype相关 0开发 其他复测-->
  <el-dialog
        :title="userType==0?'请选择开发人员':'请选择复测人员'"
    :visible.sync="userDialogVisible"
    width="65%">   <!--.sync->给父组件（toCoder/index.vue）传值-->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="加载中"
      border
      max-height="260"
      height="260"
      fit
      highlight-current-row>
      <el-table-column align="center" label="选择" width="80">
        <template slot-scope="scope">
          <el-radio v-model="userSelectionIndex" :label="scope.$index">单击</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="索引">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="username"/>
      <el-table-column label="工号" align="center" prop="number"/>
      <el-table-column label="电子邮件" align="center" prop="email"/>
      <el-table-column label="角色" align="center" prop="type"/>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 50px">
      <el-pagination
        @size-change="e=>{pageSize=e;this.getAll()}"
        @current-change="e=>{currentPage=e;this.getAll()}"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="$emit('userCancel')">取 消</el-button>
    <el-button type="primary" @click="$emit('userSubmit', {...list[userSelectionIndex]})">确 定</el-button>  <!--userSelectionIndex数组形式，用 scope.$index作为选中的用户id，-->
      <!--$emit 触发当前实例上的事件。附加参数都会传给监听器回调。-->
  </span>
  </el-dialog>

</template>

<script>
  export default {
    name: "TypeUserDialog",
    data() {
      return {
        list: [],
        listLoading: true,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        userSelectionIndex: null,
      }
    },
    props: {  //接收来自父组件的数据
      userType: {
        type: Number,
        required: true,
      },
      userDialogVisible: {
        type: Boolean
      }
    },
    created() {
      this.getAll()
    },
    methods: {
      getAll() { //getAll函数返回user表中所有的字段赋给list
        this.listLoading = true
        this.$http.get('/user', {   //springwebmvc的自动绑定赋值给service的query方法
          type: this.userType,
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      },
    }
  }
</script>

<style scoped>

</style>
