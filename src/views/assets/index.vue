<template>
  <div class="app-container">
    <el-row style="margin-bottom: 30px">
      <el-col span="3" offset="22">
        <el-button size="small" type="primary" @click="assetsDialogVisible=true,assets={}">
          添加
        </el-button>
      </el-col>
    </el-row>
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
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" prop="assetsIp"/>
      <el-table-column label="URL" align="center" prop="assetsUrl"/>
      <el-table-column label="使用部门" align="center" prop="belongedDepartment"/>
      <el-table-column label="维护接口人" align="center" prop="mainTenanceContactPerson"/>
      <el-table-column label="维护部门" align="center" prop="maintenanceDepartment"/>
      <el-table-column label="安全接口人" align="center" prop="safetyContactPerson"/>
      <el-table-column label="安全部门" align="center" prop="safetyDepartment"/>
      <el-table-column label="资产性质" align="center" prop="attributes"/>
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

    <el-dialog
      title="资产管理"
      :visible.sync="assetsDialogVisible"
      width="50%">
      <el-form ref="form" label-width="120px">
        <el-form-item label="Id">
          <el-input v-model="assets.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="IP">
          <el-input v-model="assets.assetsIp"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="assets.assetsUrl"></el-input>
        </el-form-item>
        <el-form-item label="使用部门">
          <el-input v-model="assets.belongedDepartment"></el-input>
        </el-form-item>
        <el-form-item label="维护接口人">
          <el-input v-model="assets.mainTenanceContactPerson"></el-input>
        </el-form-item>
        <el-form-item label="维护部门">
          <el-input v-model="assets.maintenanceDepartment"></el-input>
        </el-form-item>
        <el-form-item label="安全接口人">
          <el-input v-model="assets.safetyContactPerson"></el-input>
        </el-form-item>
        <el-form-item label="安全部门">
          <el-input v-model="assets.safetyDepartment"></el-input>
        </el-form-item>
        <el-form-item label="资产性质">
          <el-input v-model="assets.attributes"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="assetsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateSubmit">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        listLoading: true,
        list: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        assetsDialogVisible: false,
        assets: {}
      }
    },
    created() {
      this.getAll()
    },
    methods: {
      getAll() {
        this.listLoading = true
        this.$http.get('/assets-vulns/all', {
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      },
      coderHandleClick(row) {
        this.assets = { ...row }  //将选中的该行对象赋值给浮窗
        this.assetsDialogVisible = true
      },
      misreportHandleClick(row) {
        this.$http.delete(`/assets-vulns/${row.id}`).catch(v => {
          this.getAll()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      updateSubmit() {
        this.$http.post('/assets-vulns/assets', {
          ...this.assets
        }).then(v => {
          this.getAll()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.assetsDialogVisible = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
