// pages/index/chat/chat.js
// const app = getApp();
const { emojis, emojiToPath, textToEmoji } = require('../../../utils/emojis');
//定义worker进程变量
var worker='';
//引用CryptoJS加密插件
const CryptoJS = require('../../../utils/aes.min.js');
const app = getApp();
const inputHeight = 51;
const emojiHeight = 171;
const timeouts = [];
let windowHeight;
//消息对象
const msg={
  //文本消息
  text: function (msg) {
    var data = { 'type': 'text', 'msg': msg };
    this.send(data);
  },
  //图片消息
  image: function (src) {
    var data = { 'type': 'image', 'src': src };
    this.send(data);
  },
  //商品消息
  goods: function () {
    var data = {
      'type': 'goods',
      'title': title,
      'title_img': src,
      'price': price
    };
    this.send(data);
  },
  //心跳消息
  ping: function () {
    var data = { 'type': 'ping', 'msg': '233' };
    this.send(data);
  },
  //关闭通讯
  close:function(){
    var data={'x':'123'};
    this.send(data);
  },
  //登录消息
  login: function () {
    var data = {
      'type': 'login',
      'from_uid': app.globalData.loginInfo.id,
      'to_uid': app.globalData.staffId,
      'grade': 'user',
      'key': app.globalData.loginInfo.sessionid
    };
    this.send(data);
  },
  //发送消息
  send: function (data) {
    var msg = JSON.stringify(data);
    console.log('发送：' + msg);
    wx.sendSocketMessage({ 'data': msg });
    worker.postMessage({
      'handle':'clear'
    })
  },
};
Page({
  data: {
    userInfo: {},
    emojiList: [],
    showEmojis: false,
    showFiles: false,
    sysInfo: {},
    scrollHeight: '0',
    scrollTop: 9999,
    msg: '',
    chatList: [],
  },
  onLoad: function () {
    var that=this;  
    //创建worker进程
    worker = wx.createWorker('workers/fib/index.js');
    //获取worker进程返回的消息
    worker.onMessage((res) => {
      console.log(res)
      //发送心跳
      if (res.handle == 'ping') msg.ping();
    })
    //创建WebSocket
    wx.connectSocket({
      url:"wss://dc.ymhmjj.com:4431/webSocketServer?token="+this.token(),
    })
    //连接WebSocket成功
    wx.onSocketOpen(function(e){
      console.log('连接成功')
      msg.login()   
    })
    //监听WebSocket 接受到服务器的消息
    wx.onSocketMessage(function(e){
      console.log(e)
    })
    //监听WebSocket 服务器的连接关闭
    wx.onSocketClose(function(e){
      console.log(e)
    })
    
    // 获取表情包
    const emojiList = Object.keys(emojis).map(key => ({
      key: key,
      img: emojiToPath(key)
    }))
    // 获取屏幕高度信息
    const sysInfo = wx.getSystemInfoSync()
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight}px`
    // 获取缓存中聊天记录
    // const chatList = (wx.getStorageSync('chatList') || []).map(chat=>{
    //   if (chat.msg_type === 'text') {
    //     chat.text_list = textToEmoji(chat.msg_text)
    //   }
    //   return chat
    // })
    const chatList = (wx.getStorageSync('chatList') || [])
    // 更新状态
    this.setData({
      emojiList,
      sysInfo,
      scrollHeight,
      chatList,
    })
  },
  //获取WebSocket通讯凭证
  token:function(){
    var text = app.globalData.loginInfo.sessionid + (Date.parse(new Date()) / 1000);
    //注意密钥的个数是4的倍数
    var key = CryptoJS.enc.Utf8.parse('1aA.5-x@cxbv7856');
    var ciphertext = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    }).toString();
    var words = CryptoJS.enc.Utf8.parse(ciphertext);
    //base64加密编码，避免提交后台的时候包含转义字符导致解码失败 
    return CryptoJS.enc.Base64.stringify(words)
  },
  onUnload: function () {
    // 清除定时器
    timeouts.forEach(item => {
      clearTimeout(item)
    })
  },
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  // 隐藏表情选择框
  hideEmojis: function () {
    this.setData({ showEmojis: false });
  },
  // 隐藏或显示表情选择框
  toggleEmojis: function () {
    const { showEmojis, showFiles } = this.data;
    if (showFiles) {
      this.setData({
        showEmojis: true,
        showFiles: false
      });
    } else {
      if (showEmojis) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showEmojis: !showEmojis
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showEmojis: !showEmojis
        });
        this.goBottom(50);
      }
    }
  },
  // 隐藏或显示图片选择框
  toggleFiles: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis) {
      this.setData({
        showEmojis: false,
        showFiles: true
      });
    } else {
      if (showFiles) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showFiles: !showFiles
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showFiles: !showFiles
        });
        this.goBottom(50);
      }
    }
  },
  inputFocus: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  inputMsg: function (e) {
    //
  },
  blurInput: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  // 点击滚动框
  scrollClick: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  // 点击表情
  clickEmoji: function (e) {
    const { key } = e.currentTarget.dataset;
    const { msg } = this.data;
    this.setData({ msg: msg + key });
  },
  // 发送信息
  sendMsg: function (e) {
    const { msg, chatList } = this.data
    if (!msg) {
      return
    }
    const newChatList = [...chatList, {
      msg_type: 'text',
      msg_text: msg,
      text_list: textToEmoji(msg)
    }]
    this.setData({
      chatList: newChatList,
      msg: ''
    })
    wx.setStorageSync('chatList', newChatList);
    this.goBottom(500);
  },
  // 发送图片
  sendPic: function (e) {
    const that = this
    const { chatList } = this.data

    wx.chooseImage({
      count: 1,
      success: function (res) {
        const src = res.tempFilePaths[0]
        wx.getImageInfo({
          src,
          success: function (res) {
            const { width, height } = res
            const newChatList = [...chatList, {
              msg_type: 'image',
              msg_image: { src, width, height }
            }]
            that.setData({ chatList: newChatList })
            wx.setStorageSync('chatList', newChatList);
            that.goBottom(500);
          }
        })
      }
    })
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.id]
    })
  },
  //监听页面卸载
  onUnload:function(){
    //删除worker进程
    worker.terminate();
    //删除WebSocket进程
    msg.close();
  }
})