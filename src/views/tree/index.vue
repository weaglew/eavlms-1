<template>
  <div class="app-container">
    <el-input placeholder="请输入资产IP/URL" style="width: 200px;margin-left: 20px;margin-top: 20px;margin-bottom: 20px"
              v-model="search.ipOrUrl"/>
    <el-input placeholder="请输入关键字" style="width: 200px;margin-left: 20px;margin-top: 20px;margin-bottom: 20px"
              v-model="search.keyword"/>
    <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="queryCustomize">
      Search
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
    >
      <!--表格展示开始，此处展示漏洞的字段-->
      <el-table-column type="expand" fixed>
        <template slot-scope="props">
          <div class="table-expand">
            <el-table
              inline
              border
              stripe
              size="mini"
              width="60%"
              :data="props.row.vulns">
              <el-table-column label="存在漏洞系统名" align="center" prop="vulnSystemName"/>
              <el-table-column label="发现者" align="center" prop="vulnsCreatePerson"/>
              <el-table-column label="发现时间" align="center" prop="vulnsCreateTime"/>
              <el-table-column label="漏洞名称" align="center" prop="vulnsName"/>
              <el-table-column label="漏洞等级" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.vulnsRand|vulnsRand">{{scope.row.vulnsRand}}</el-tag>
                </template>
              </el-table-column>


              <el-table-column label="当前状态" align="center">
                <template slot-scope="scope">
                  {{scope.row.vulnsState|vulnsStateText}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="索引">
        <template slot-scope="scope">
          {{ scope.$index +1}}
        </template>
      </el-table-column>

      <!--资产相关-->
      <el-table-column label="IP" align="center" prop="assetsIp"/>
      <el-table-column label="URL" align="center" prop="assetsUrl"/>
      <el-table-column label="使用部门" align="center" prop="belongedDepartment"/>
      <el-table-column label="维护接口人" align="center" prop="mainTenanceContactPerson"/>
      <el-table-column label="维护部门" align="center" prop="maintenanceDepartment"/>
      <el-table-column label="安全接口人" align="center" prop="safetyContactPerson"/>
      <el-table-column label="安全部门" align="center" prop="safetyDepartment"/>
      <el-table-column label="资产性质" align="center" prop="attributes"/>
    </el-table>
    <!--展开展示功能结束-->
    <!--分页功能开始-->
    <!--页码-->
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
    <!--页码结束-->
  </div>
</template>

<script>
  import { export_json_to_excel } from '@/utils/export2excel'
  //导入抽离的漏洞状态转化
  import { vulnsState, vulnsRand, vulnsStateText } from '@/utils/vulns-info'

  export default {
    filters: {
      vulnsState,
      vulnsRand,
      vulnsStateText
    },
    data() {
      return {
        list: [],
        listLoading: true,
        search: {
          ipOrUrl: '',
          keyword: ''
        },
        //分页所需字段
        pageSize: 10,
        total: 0,
        currentPage: 1,
        downloading: false
      }
    },
    created() {
      this.listLoading = false
      this.getAll()
    },
    methods: {
      queryCustomize() {
        this.listLoading = true
        this.$http.get('/assets-vulns/keywords', {
          page: this.currentPage - 1,
          size: this.pageSize,
          ...this.search
        }).then(response => {
          // this.list = this.groupByAssets(response.content)
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
          })
      },
      downloadHandleClick() {
        this.downloadLoading = true
        let header = [
          'vulnsName',
          'vulnsState',
          'vulnSystemName',
          'vulnsCreatePerson',
          'vulnsCreateTime',
          'vulnsDescription',
          'vulnsRand',
          'assets',
          'assetsUrl',
          'assetsIp',
          'attributes',
          'belongedDepartment',
          'mainTenanceContactPerson',
          'maintenanceDepartment',
          'safetyContactPerson',
          'safetyDepartment'
        ]

        let chineseHeader = [
          '漏洞名',
          '漏洞状态',
          '系统名',
          '创建人',
          '创建时间',
          '漏洞描述',
          '漏洞等级',
          '对应资产id',
          '对应资产url',
          '对应资产ip',
          '资产属性',
          '所属部门',
          '主要人员',
          '主要部门',
          '安全人员',
          '安全部门'
        ]
        //将his.list中每一个assets的漏洞字段进行遍历，添加上资产信息 并按照表头顺序排好赋给tabledata
        let tabledata = this.formatJson(header, this.list.flatMap(v => {  //flatmap函数用于遍历this.list数组 v是数组中每一个assets
          v.vulns.forEach(m => { //该循环将每一条资产的漏洞字段进行遍历
            m.assets = v.id  //取出当前资产的id 给现在循环的漏洞list的当前元素m 添加新字段assets 最后把每一条资产信息转换成以漏洞信息为主返回给v
            m.assetsUrl = v.assetsUrl
            m.assetsIp = v.assetsIp
            m.attributes = v.attributes
            m.belongedDepartment = v.belongedDepartment
            m.mainTenanceContactPerson = v.mainTenanceContactPerson
            m.maintenanceDepartment = v.maintenanceDepartment
            m.safetyContactPerson = v.safetyContactPerson
            m.safetyDepartment = v.safetyDepartment
            return m
          })
          return v.vulns  //
        }))
        export_json_to_excel({  //data和header组成对象传给调用组件
          data: tabledata,
          header: chineseHeader
        })
        this.downloadLoading = false
      },

      //按照表头的顺序排好各行 赋值给tabledata
      formatJson(filterVal, jsonData) { //map遍历返回数据
        return jsonData.map(v => filterVal.map(j => {  //j是表头
          return v[j]  //遍历当前行的各列
        }))
      },
      getAll() {
        this.listLoading = true
        //$http是全局Vue对象 用this代表，this.$http.get表示使用http对象的get方法
        this.$http.get('/assets-vulns/all', {
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          //表格的数据
          this.list = response.content
          //总共的个数，主要用于分页
          this.total = response.totalElements
          //加载动画
          this.listLoading = false
        })
      },


    }
  }
</script>
