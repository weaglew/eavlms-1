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
          {{ scope.row.vulns.assets.maintenanceDepartment }}
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
      <el-table-column class-name="status-col" label="下发时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" label="修复人" align="center">
        <template slot-scope="scope">
          {{ scope.row.coder.username }}
        </template>
      </el-table-column>


      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-popconfirm
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="misreportHandleSucClick(scope.row)"
            title="确定整改成功吗？">
            <el-button slot="reference"
                       size="mini">成功
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="misreportHandleCalClick(scope.row)"
            title="确定为误报吗？">
            <el-button slot="reference"
                       size="mini" type="danger">误报
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
  import { vulnsRand, vulnsStateText, vulnsState } from '@/utils/vulns-info.js'

  export default {
    filters: {
      vulnsRand, vulnsStateText, vulnsState
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
        this.$http.get('/to-coder', {
          'coder.id': JSON.parse(sessionStorage.getItem('user')).id,
          'vulns.vulnsState': '1',
          state: 0,
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      },
      misreportHandleSucClick(row) {
        console.log('misreportHandleSucClick', row)
        this.$http.post('/to-coder/updateState', {
          id: row.id,
          vulns: {
            id: row.vulns.id
          },
          state: 1
        }).then(v => {
          this.getAll()
        })
      },

      misreportHandleCalClick(row) {
        console.log('misreportHandleCalClick', row)
        this.$http.post('/to-coder/updateState', {
          id: row.id,
          vulns: {
            id: row.vulns.id
          },
          state: 3
        }).then(v => {
          this.getAll()
        })
      }

    }
  }
</script>
