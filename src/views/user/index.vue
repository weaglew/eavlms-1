<template>
  <div class="app-container">
    <el-row style="margin-bottom: 30px">
      <el-col span="3" offset="22">
        <el-button size="small" type="primary" @click="userDialogVisible=true,user={}">   <!--显示添加框，清空user（按钮也可以触发代码片段）-->
          添加
        </el-button>
      </el-col>
    </el-row>
    <!--显示数据-->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="加载中"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="索引" fixed width="60">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" fixed prop="username"/>
      <el-table-column label="工号" align="center" prop="number"/>

      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          {{ '******' }}
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.type|typeFilter}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email"/>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="coderHandleClick(scope.row)">修改</el-button>
          <el-popconfirm
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="misreportHandleClick(scope.row)"
            title="确定删除吗？">
            <el-button slot="reference"
                       size="mini" type="danger">删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--增删改用户-->

    <el-dialog
      title="用户管理"
      :visible.sync="userDialogVisible"
      width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="Id">
          <el-input v-model="user.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="user.number"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select style="width: 100%" v-model="user.type">
            <el-option label="企业" value="0"></el-option>
            <el-option label="开发" value="1"></el-option>
            <el-option label="安全" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="userDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateSubmit">确 定</el-button>
  </span>
    </el-dialog>


  </div>


</template>

<script>
  export default {
    name: 'index',
    filters: {
      typeFilter(type) {
        const typeName = {
          0: '企业',
          1: '开发',
          2: '安全'
        }
        return typeName[type]
      }
    },
    created() {
      this.getAll()
    },
    data() {
      return {
        listLoading: true,
        list: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        userDialogVisible: false,
        user: {}
      }
    },
    methods: {
      getAll() {
        this.listLoading = true
        this.$http.get('/user/all', {
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      },
      coderHandleClick(row) {
        this.user = { ...row }
        this.userDialogVisible = true
      },
      misreportHandleClick(row) {
        this.$http.delete(`/user/${row.id}`).then(v => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAll()
        }).catch(v => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAll()
        })
      },
      updateSubmit() {
        this.userDialogVisible = false
        this.$http.post('/user', {
          ...this.user
        }).then(v => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getAll()
        })
      }
    }
  }
</script>

<style scoped>

</style>
