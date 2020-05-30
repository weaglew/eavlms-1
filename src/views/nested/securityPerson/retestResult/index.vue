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
      <el-table-column align="center" label="索引" fixed width="60">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="系统名">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnSystemName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="漏洞名">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnsName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.assetsIp }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="URL">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.assetsUrl }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用部门">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.belongedDepartment }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="维护接口人">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.mainTenanceContactPerson }}
        </template>
      </el-table-column>


      <el-table-column align="center" label="维护部门">
        <template slot-scope="scope">
          {{ scope.row.vulns.assets.maintenanceDepartment}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="发现时间">
        <template slot-scope="scope">
          {{ scope.row.vulns.vulnsCreateTime }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="漏洞等级" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.vulns.vulnsRand | vulnsRand">{{ scope.row.vulns.vulnsRand }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="下发人" align="center">
        <template slot-scope="scope">
          {{ scope.row.enterprise.username }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="测试下发时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="测试人" align="center">
        <template slot-scope="scope">
          {{ scope.row.security.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="修复结果" fixed="right">
        <template slot-scope="scope">
          {{ scope.row.state==1?'成功':'尚未成功' }}
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
  export default {
    filters: {
      statusFilter(vulnsRand) {
        const statusMap = {
          低危: 'success',
          中危: 'gray',
          高危: 'danger'
        }
        return statusMap[vulnsRand]
      }
    },
    data() {
      return {
        list: [],
        listLoading: true,
        pageSize: 10,
        total: 0,
        currentPage: 1,
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
