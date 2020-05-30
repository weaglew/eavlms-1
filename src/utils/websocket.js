//用于连接websocket 浏览器方法
//获取 Web Socket 连接后，可以通过 send() 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据
export default {
  init: (fn) => {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
      //后端地址
      let socketUrl = 'ws://localhost:8080/notice-ws/' + user.id
      let socket = new WebSocket(socketUrl)
      //打开 连接建立时触发
      socket.onopen = () => {
        console.log('WebSocket已打开')
      }
      //关闭 连接关闭时触发
      socket.onclose = () => {
        console.log('WebSocket已关闭')
      }
      //通信发生错误时触发
      socket.onerror = () => {
        console.log('WebSocket发生了错误')
      }
      //消息 客户端接收服务端数据时触发
      socket.onmessage = (data) => {
        data = JSON.parse(data.data)  //将data字符串转换为对象
        console.log('WebSocket收到服务端信息：', data)
        fn(data)
      }
    }
  }
}
