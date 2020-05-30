import RemoteUrl from './remote-url'

//函数名固定写法
export default function install(Vue, options) {
  //给Vue添加http请求字段，以后直接用this就可以获取，此时$http成为全局Vue对象；（在原型上定义它们使其在每个 Vue 的实例中可用）
  Vue.prototype.$http = {  //http这个对象有以下四个方法，其各自的主要内容在下方封装内容里；$符号目的：避免和已被定义的数据、方法、计算属性产生冲突
    get: getHttp,
    post: postHttp,
    put: putHttp,
    delete: deleteHttp
  }
}


//get请求封装
function getHttp(url, params) { //括号()代表执行函数
  console.log(RemoteUrl + url + `?${new URLSearchParams(params).toString()}`);
  //$开头的字段名注入到vue对象中，整个系统可用，不用每次进行new urlsearchparams，因为下面一行对传入的参数进行了格式化
  return window.fetch(RemoteUrl + url + `?${new URLSearchParams(params).toString()}`, {
    method: "GET",
  }).then(response => response.json())

}

//post请求封装
function postHttp(url, params) {
  return window.fetch(RemoteUrl + url, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params)       //请求体内容：把对象转为json 用于传输 序列化
  }).then(response => response.json())  //response => response.json()该箭头函数中，response指响应包中的全部内容，response.json()将返回体中的json字符串   转为对象传递给v 反序列化  没有返回的json的就传null给v
}

//put请求封装
function putHttp(url, params) {
  return window.fetch(RemoteUrl + url, {
    method: "PUT",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(response => response.json())
}

//delete请求封装
function deleteHttp(url, params) {
  return window.fetch(RemoteUrl + url + `?${new URLSearchParams(params).toString()}`, {  //es6 `${需要拼接进去的字符串变量}` 模板字符串
    method: "DELETE",
  }).then(response => response.json())
}
