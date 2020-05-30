//漏洞状态格式化
/**
 * 漏洞在数据库中有六个状态
 * 0 漏洞未修复状态
 * 1 漏洞修复——已下发给开发人员
 * 2 待复测（用于显示在企业的“需复测漏洞表中”）
 * 3 已下发给复测（安全）人员
 * 4 误报状态
 * 5 修复确认状态
 * success/info/warning/danger
 */
export const vulnsState = (value) => {  //vulnsState函数名 (value)形参 [value]返回的结果
  const statusMap = {
    0: 'info',
    1: 'gray',
    2: 'info',
    3: 'gray',
    4: 'warning',
    5: 'success'
  }
  return statusMap[value]
}
export const vulnsStateText = (value) => {
  const statusMap = {
    0: '待修复',
    1: '已下发开发人员',
    2: '待复测',
    3: '已下发测试人员',
    4: '误报',
    5: '修复确认'
  }
  return statusMap[value]
}
//漏洞等级格式化
export const vulnsRand = (value) => {
  const statusMap = {
    '低危': 'success',
    '中危': 'gray',
    '高危': 'danger'
  }
  return statusMap[value]
}
