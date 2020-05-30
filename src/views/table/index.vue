<template>
  <div>
    <el-input placeholder="关键字搜索CVE编号" style="width: 200px;margin-left: 20px;margin-top: 20px;margin-bottom: 20px"
              v-model="search.cveid"/>
    <el-input placeholder="关键字搜索漏洞描述" style="width: 200px;margin-left: 20px;margin-top: 20px;margin-bottom: 20px"
              v-model="search.description"/>
    <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="queryCves">
      Search
    </el-button>
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addHandleClick">
      Add
    </el-button>
    <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="downloadHandleClick">
      Export
    </el-button>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-left: 20px"
    >
      <el-table-column align="center" label="索引" width="70">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="CVE-ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.cveid }}
        </template>
      </el-table-column>
      <el-table-column label="漏洞描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description |ellipsis }}
        </template>
      </el-table-column>
      <el-table-column label="参考资料" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reference | ellipsis }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.updatetime }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新人员" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.author | statusFilter_author">{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="dialogTableVisible = true,dialogTableData=scope.row">查看
          </el-button>
          <el-dialog :visible.sync="dialogTableVisible">
            <h2>漏洞编号：</h2>{{dialogTableData.cveid }}
            <h2>漏洞描述：</h2>{{dialogTableData.description}}
            <h2>参考链接：</h2>{{dialogTableData.reference}}
          </el-dialog>
          <el-button type="text" size="small" @click="updateHandleClick(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button>
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
      title=""
      :visible.sync="updateDialogVisible"
      width="30%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="Id">
          <el-input v-model="updateForm.cveid"></el-input>
        </el-form-item>
        <el-form-item label="更新人员">
          <el-input v-model="updateForm.author"></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="updateForm.updatetime"></el-input>
        </el-form-item>
        <el-form-item label="参考资料">
          <el-input v-model="updateForm.reference"></el-input>
        </el-form-item>
        <el-form-item label="漏洞描述">
          <el-input type="textarea" v-model="updateForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateSubmit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import url from '../../utils/remote-url'
  import { export_json_to_excel, formatJson } from '@/utils/export2excel'

  export default {
    filters: {
      ellipsis(value) {
        if (!value) return ''
        if (value.length > 30) {
          return value.slice(0, 30) + '...'
        }
        return value
      }
    },
    data() {
      return {  //返回给当前组件数据 固定写法
        list: [],
        listLoading: true,
        //{key:value}格式赋值
        search: {
          cveid: '',
          description: ''
        },
        dialogTableVisible: false,
        //设置中间的dialogTableData参数接收scope数据，然后再从dialogTableData里提取分条数据
        dialogTableData: {},  //对象
        updateDialogVisible: false,

        updateForm: {
          cveid: '',
          author: '',
          description: '',
          reference: '',
          updatetime: ''
        },
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    created: function() {
      this.getAll()
      // this.listLoading = false
      //
      // // get方法的传参格式，类似于page=0&size=10
      // const urlSearchParams = new URLSearchParams({
      //   page: 0,
      //   size: 10
      // })


      // // 发起异步请求
      // fetch(url + '/cves/all?' + urlSearchParams.toString(), {
      //   method: 'GET'
      // })
      //   // 请求返回json格式
      //   .then(response => response.json())
      //   // 真正服务器返回的数据，对响应的所有数据操作均在此函数内
      //   .then(response => {
      //     this.list = response.content
      //   })
    },
    methods: {
      getAll() {
        this.listLoading = true
        this.$http.get('/cves/all', {
          page: this.currentPage-1,  //vue页码从1开始 后台从0开始 故-1
          size: this.pageSize
        }).then(response => {
          this.list = response.content  //page里的content字段，保存的是cves的list集合
          this.total = response.totalElements  //查回来的记录条总数
          this.listLoading = false
        })
      },
      deleteHandleClick(row) {
        console.log('row', row)
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/cves', {
            cveid: row.cveid
          }).then(response => {
            console.log('response')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAll()
          }).catch(res => {
            this.getAll(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getAll()
            })
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      },
      addHandleClick() {
        this.updateForm = {}
        this.updateDialogVisible = true
      },
      updateHandleClick(row) {
        this.updateDialogVisible = true
        this.updateForm = row
      },
      updateSubmit() {
        this.updateDialogVisible = false
        this.$http.post('/cves', {
          ...this.updateForm
        }).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getAll()
        })
      },
      downloadHandleClick() {
        let header = [
          'cveid',
          'author',
          'description',
          'reference',
          'updatetime'
        ]

        let chineseHeader = [
          'Id',
          '更新人员',
          '漏洞描述',
          '参考资料',
          '更新时间'
        ]
        let tabledata = this.formatJson(header, this.list)
        export_json_to_excel({  //导出excel
          data: tabledata,
          header: chineseHeader
        })
      },
      //按照表头的顺序排好各行 赋值给tabledata
      formatJson(filterVal, jsonData) {  //定下header表头 向内填数据 格式化数据  两个数组遍历
        return jsonData.map(v => filterVal.map(j => {  //j是表头
          console.log('j', j)
          console.log('j', v[j])
          return v[j]  //遍历当前行的各列
        }))
      },
      //查询按钮绑定的查询函数
      queryCves(event) {
        let urlSearchParams = new URLSearchParams({
          page: 0,
          size: 10,
          //...表示解构赋值，即相当于把search里面的字段和值全拿出来放在这
          //* cveid: '',
          // * description: ''
          ...this.search //this表示这个vue组件，search是上方data函数定义的
          //发起查询请求
        })
        fetch(url + '/cves?' + urlSearchParams.toString(), {
          method: 'GET'       //url=/cves?page=0&size=10&cveid=xxx&description=xxx
        })
          // 请求返回json格式
          .then(response => response.json())
          // 真正服务器返回的数据，对响应的所有数据操作均在此函数内
          .then(response => {
            this.list = response.content
          })
      }
    }
  }
</script>
