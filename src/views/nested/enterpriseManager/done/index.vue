<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="加载中"
      border
      max-height="390"
      height="390"
      fit
      highlight-current-row>
      <el-table-column align="center" label="索引">
        <template slot-scope="scope">
          {{ scope.$index}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统名">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnSystemName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="资产IP">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.assetsIp }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="资产URL">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.assetsUrl }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="维护部门">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.maintenanceDepartment}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="漏洞名称">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnsName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="漏洞发现者">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnsCreatePerson }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发现时间">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnsCreateTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="复测人员">
        <template slot-scope="scope">
          {{ scope.row.security.username}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业下发人">
        <template slot-scope="scope">
          {{ scope.row.enterprise.username}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="结果" width="60">
        <template slot-scope="scope">
          {{ scope.row.state ==1?'成功':'尚未成功'}}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="漏洞等级" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.vulns.vulnsRand | statusFilter">{{ scope.row.vulns.vulnsRand }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            icon="el-icon-info"
            @onConfirm="misreportHandleClick(scope.row)"
            title="修复确认吗？">
            <el-button slot="reference" type="danger"
                       size="mini">确认
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
  </div>
</template>

<script>
  import TypeUserDialog from '@/components/user-type-dialog'

  export default {

    filters: {
      statusFilter(vulnsRand) {
        const statusMap = {
          低危: 'success',
          中危: 'gray',
          高危: 'danger'
        }
        return statusMap[vulnsRand]
      },
      statusFilter_vulnsState(vulnsState) {
        const statusMap = {
          已修复: 'success'
        }
        return statusMap[vulnsState]
      }
    },
    components: {
      TypeUserDialog
    },
    data() {
      return {
        list: [],
        listLoading: true,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        userDialogVisible: false,
        userSelection: null,
        vulnsSelection: null
      }
    },
    created() {
      this.getAll()
    },
    methods: {
      getAll() {
        this.listLoading = true
        this.$http.get('/to-security', {
          state: 1,
          'vulns.vulnsState': 3,
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      },
      misreportHandleClick(row) {
        console.log('misreportHandleClick', row)
        this.$http.post('/assets-vulns/updateState', {
          id: row.vulns.id,
          vulnsState: 5,
          'createUser.id': JSON.parse(sessionStorage.getItem('user')).id
        }).then(v => {
          this.getAll()
        })
      }
    }
  }
</script>
