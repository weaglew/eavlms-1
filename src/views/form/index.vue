<template>
    <div class="app-container">
        <h2 style="text-align: center">
            新 增
        </h2>
        <!--需要在登陆情况下使用该页面，因为需要调用session值，-->
        <el-row style="margin-bottom: 30px">
            <el-col span="4" offset="3">
                <el-button size="small" type="primary" @click="fileDialogVisible=true">
                    选取文件插入表单中
                </el-button>
            </el-col>
            <el-col span="2" offset="11">
                <el-button size="small" type="primary" @click="downloadHandleClick">
                    导出Excel文件
                </el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-col span="24">
                <div class="form">
                    <el-form ref="vulnForm" :model="vulnForm" label-width="auto">
                      <!--v-mddel vue实例中的data与其渲染的dom元素上的内容保持一致-->
                        <!-- 弹框选择-->
                        <el-form-item label="企业资产" required>
                            <div @click="assetsHandleClick">
                                <el-input
                                        v-model="vulnForm.assets.assetsUrl"
                                        readonly/>
                            </div>
                        </el-form-item>

                      <!--prop取值 v-model数据绑定-->
                        <el-form-item label="漏洞名称" prop="vulnsName" required>
                            <el-input v-model="vulnForm.vulnsName"/>
                        </el-form-item>

                        <el-form-item label="脆弱系统名称" prop="vulnSystemName" required>
                            <el-input v-model="vulnForm.vulnSystemName"/>
                        </el-form-item>

                        <el-form-item label="漏洞等级" prop="vulnsRand" required>
                            <el-select style="width: 100%" placeholder="" v-model="vulnForm.vulnsRand">
                                <el-option label="低危" value="低危"></el-option>
                                <el-option label="中危" value="中危"></el-option>
                                <el-option label="高危" value="高危"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="漏洞发现者" prop="vulnsCreatePerson" required>
                            <el-input v-model="vulnForm.vulnsCreatePerson" readonly/>
                        </el-form-item>

                        <el-form-item label="漏洞发现时间" prop="vulnsCreateTime" required>
                            <el-date-picker placeholder="" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            v-model="vulnForm.vulnsCreateTime" type="datetime" style="width: 100%;"/>
                        </el-form-item>
                        <el-form-item label="漏洞描述" prop="vulnsDescription">
                            <el-input v-model="vulnForm.vulnsDescription" type="textarea"/>
                        </el-form-item>
                        <el-form-item>
                            <el-col offset="4" span="2">
                                <el-button type="primary" @click="onSubmit" :loading="submitLoading">确定提交</el-button>
                            </el-col>
                            <el-col offset="6" span="">
                                <el-button @click="onRest">重置</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>

        <!--   上传文件对话框 ref指当前标签-->
        <el-dialog
                title="上传文件"
                :visible.sync="fileDialogVisible"
                width="500px">
            <el-upload
                    ref="xlsxUpload"
                    class="upload"
                    drag
                      :http-request="xlsxUploadBefore"
                    auto-upload='false' action="">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" style="text-align: center"
                     slot="tip">只能上传xls / xlsx文件
                </div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
    <el-button @click="fileDialogVisible = false,onRest()">取 消</el-button>
    <el-button type="primary" @click="xlsxUploadSubmit">确 定</el-button>
  </span>
        </el-dialog>
        <!--    企业资产选择对话框-->
        <el-dialog
                title="请选择企业资产"
                :visible.sync="assetsDialogVisible"
                width="80%">
            <el-table
                    v-loading="listLoading"
                    :data="list"
                    height="280"
                    max-height="280"
                    element-loading-text="加载中"
                    border
                    fit
                    stripe
                    ref="assetsTable"
                    row-key="id"
                    highlight-current-row>
                <el-table-column
                        label="选择"
                        align="center">
                    <template slot-scope="scope">
                        <el-radio v-model="assetsSelection" :label="scope.$index">单击</el-radio>  <!--存储第几个点击 该值是label的值 list只有当前页的数据-->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="索引">
                    <template slot-scope="scope">
                        {{ scope.$index }}
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
            </el-table>
            <el-row type="flex" justify="end" style="margin-top: 10px;margin-bottom: 0">
                <el-pagination
                        @size-change="e=>{pageSize=e;this.getAllAssets()}"
                        @current-change="e=>{currentPage=e;this.getAllAssets()}"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="sizes, prev, pager, next"
                        :total="total">
                </el-pagination>
            </el-row>
            <span slot="footer" class="dialog-footer">
    <el-button @click="assetsDialogVisible = false">取 消</el-button>
    <el-button type="primary"
               @click="assetsDialogSubmit">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
  import { export_json_to_excel, formatJson } from '@/utils/export2excel'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        list: [],
        listLoading: true,
        pageSize: 10,
        total: 0,
        currentPage: 1,
        //输入表单
        vulnForm: {
          vulnsName: null,
          vulnsRand: null,
          vulnSystemName: null,
          //登录后用户信息保存在sessionStorage，直接取值
          vulnsCreatePerson: JSON.parse(sessionStorage.getItem('user')).username,
          vulnsCreateTime: null,
          vulnsDescription: null,
          vulnsState: 0,
          assets: {
            id: null,
            assetsUrl: null
          }
        },
        //选择文件对话框显示与隐藏
        fileDialogVisible: false,
        //资产对话框
        assetsDialogVisible: false,
        //选择的资产对象
        assetsSelection: null,
        submitLoading: false
      }
    },
    created() {
      this.getAllAssets()
    },
    methods: {
      onRest() {
        this.restForm()
      },
      xlsxUploadSubmit() {
        console.log(this.$refs.xlsxUpload)
        this.fileDialogVisible = false
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)   //test()是正则表达式方法，与模板匹配返回true 不匹配返回false \.转义. //范围 $结束
      },
      xlsxUploadBefore({ file }) {
        if (!file) return
        if (!this.isExcel(file)) {
          this.$message({
            text: '请选择XLSX文件'
          })
          return
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.readData(file)
        loading.close()
      },
      readData(file) {
        return new Promise((resolve, reject) => {  //promise 为了解决异步问题的内置对象 有三种状态 Pending（进行中）、Resolved（已完成）、Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
         //此处resolve和reject方法都没用到，以下代码是异步成功或失败都执行的
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const header = this.getHeaderRow(worksheet)
            const results = XLSX.utils.sheet_to_json(worksheet)  //读取文件格式转化
            console.log('header', header)
            console.log('results', results)
            this.generateData({ header, results })  //渲染数据到表格
            resolve()
          }
          reader.readAsArrayBuffer(file)
        })
      },
      generateData({ header, results }) {  //{}因为没有对象名 解构赋值； 直接（）是有对象名
        this.vulnForm.vulnsName = results[0]['漏洞名']   //results[0]['漏洞名']取表格第一行的数据（数据仅一行）赋给变量vulnsname
        this.vulnForm.vulnsRand = results[0]['漏洞等级']
        this.vulnForm.vulnSystemName = results[0]['系统名']
        this.vulnForm.vulnsCreateTime = results[0]['创建时间']
        this.vulnForm.vulnsDescription = results[0]['漏洞描述']
      },
      getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C   /*let声明变量 仅在let命令所在代码块内有效；var在方法内部是局部变量，在方法外部是全局变量*/
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },

      onSubmit() {
        this.submitLoading = true  //true：后端还未有数据传入时显示等待动画
        if (this.assetsSelection == null) {
          this.$message.error('请填写资产信息！')
          this.submitLoading = false
          return
        }
        this.$http.post('/assets-vulns', {
          ...this.vulnForm, //将vulnForm对象进行解构，加入用户id和资产id 重新封装为对象传给后台public Vulns save(@RequestBody Vulns vulns)函数
          createUser: {
            id: JSON.parse(sessionStorage.getItem('user')).id   //user定义:views/login/index.vue 154行  此为将json字符串转成对象取id
          },
          assets: { id: this.list[this.assetsSelection].id }
        }).then(v => {   //v:指http-plugin.js中post请求then里已把对象转化为json的信息 或null 响应码非200走catch
          console.log('onSubmit', v)
          this.submitLoading = false
          this.$message({
            message: '上报成功！',
            type: 'success'
          })
          this.$refs.vulnForm.resetFields()   //清空
          this.restForm()
        }).catch(v => {
          this.$message.error('上报失败！')
        })    //当后端有数据返回时调用then函数，出错了就调用catch函数
      },
      downloadHandleClick() {
        let header = [
          'vulnsName',
          'vulnsRand',
          'vulnSystemName',
          'vulnsCreatePerson',
          'vulnsCreateTime',
          'vulnsDescription',
          'vulnsState'
        ]

        let chineseHeader = [
          '漏洞名',
          '漏洞等级',
          '系统名',
          '创建人',
          '创建时间',
          '漏洞描述',
          '漏洞状态',
          '对应资产id',
          '对应资产URL'
        ]
        let tabledata = this.formatJson(header, [this.vulnForm])
        tabledata[0].push(this.vulnForm.assets.id)
        tabledata[0].push(this.vulnForm.assets.assetsUrl)
        export_json_to_excel({
          data: tabledata,
          header: chineseHeader
        })
      },
      //按照表头的顺序排好各行 赋值给tabledata
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {  //map遍历返回数组 j是表头
          console.log('j', j)
          console.log('j', v[j])
          return v[j]  // 遍历当前行的各列
        }))
      },
      restForm() {
        this.assetsSelection = null
        this.$refs.vulnForm.resetFields()
        this.vulnForm.assets = {}
      },
      assetsHandleClick() {
        this.assetsDialogVisible = true
      },
      assetsDialogSubmit() {
        this.assetsDialogVisible = false
        this.vulnForm.assets = this.list[this.assetsSelection]  //选中的assets对象赋值给vulnform变量的assets对象
      },
      getAllAssets() {
        this.listLoading = true
        console.log({
          page: this.currentPage - 1,
          size: this.pageSize
        })
        this.$http.get('/assets-vulns/all', {
          page: this.currentPage - 1,
          size: this.pageSize
        }).then(response => {
          this.list = response.content
          this.total = response.totalElements
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .line {
        text-align: center;
    }

    .form {
        width: 80%;
        padding: 50px 50px;
        margin: 0 auto;
        box-shadow: 0 0 2px #bbb9b9;
    }

    .upload {
        margin: 0 auto;
        padding: 0 50px;
    }

</style>

