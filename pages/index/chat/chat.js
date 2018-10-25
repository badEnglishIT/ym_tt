//定义worker进程变量
var worker='';
//引用CryptoJS加密插件
const CryptoJS = require('../../../utils/aes.min.js');
const app = getApp();
const imgDomain='http://image.ymindex.com';
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
    //增加新的记录值
    var currPage = getCurrentPages(); 
    currPage[currPage.length - 1].pushChat(data);
  },
  //图片消息
  image: function (src) {
    var data = { 'type': 'image', 'src': src };
    this.send(data);
    //增加新的记录值
    data.src = imgDomain+data.src;
    var currPage = getCurrentPages();
    currPage[currPage.length - 1].pushChat(data);
  },
  //商品消息
  goods: function (title,src,price) {
    var data = {
      'type': 'goods',
      'title': title,
      'title_img': src,
      'price': price
    };
    this.send(data);
    //增加新的记录值
    data.title_img = imgDomain + data.title_img;
    var currPage = getCurrentPages();
    currPage[currPage.length - 1].pushChat(data);
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
      'from_uid': parseInt(app.globalData.loginInfo.id),
      'to_uid': parseInt(app.globalData.staffId),
      'grade': 'user',
      'key': app.globalData.loginInfo.socket
    };
    this.send(data);
  },
  //发送消息
  send: function (data) {
    var msg = JSON.stringify(data);
    console.log('发送：' + msg);
    wx.sendSocketMessage({
      'data': msg, 
      success: function () {
        worker.postMessage({'handle': 'clear'})
      }
    });   
  },
};
Page({
  data: {
    thumbWidth: 250,//压缩宽度
    thumbHeight: 0,//压缩高度
    userInfo: {},
    emojiList: [],
    showEmojis: false,
    showFiles: false,
    sysInfo: {},
    scrollHeight: '0',
    scrollTop: 9999,
    msg: '',//要发送的消息
    chatList: [],//聊天列表
    staffInfo:'',//员工信息
    userInfo:'',//用户信息
    goodsInfo: false,//'是否咨询商品',
  },
  onLoad: function (options) {
    if(options.type=='goods'){
      this.setData({ goodsInfo: JSON.parse(options.data)});
      console.log(JSON.parse(options.data))
    }
    console.log(app.globalData);
    this.setData({ userInfo: app.globalData.loginInfo});
    console.log(this.data.chatList);
    var that=this;  
    //创建worker进程
    worker = wx.createWorker('workers/fib/index.js');
    //获取worker进程返回的消息
    worker.onMessage((res) => {
      //发送心跳
      if (res.handle == 'ping') msg.ping();
    })
    wx.request({
      url: app.d.hostUrl + 'index/time',
      success: function (res) {
        //创建WebSocket
        wx.connectSocket({
          url: "wss://push.ymindex.com/wss/webSocketServer?token="
            + that.token(res.data),
        })
      }
    })
    //连接WebSocket成功
    wx.onSocketOpen(function(e){
      console.log('连接成功')
      msg.login()   
    })
    //监听WebSocket 接受到服务器的消息
    wx.onSocketMessage(function(e){
      var data = JSON.parse(e.data);
      console.log(data)
      switch(data.type){
        case 'login':
          var goodsInfo = that.data.goodsInfo;
          console.log(goodsInfo);
          if (goodsInfo){
            msg.goods(goodsInfo.title,goodsInfo.title_img,goodsInfo.price);
          }
        break;
      }
    })
    //监听WebSocket 服务器的连接关闭
    wx.onSocketClose(function(e){
     console.log(e)
    })
    this.staffInfo();
    this.chatList();
    // 获取屏幕高度信息
    const sysInfo = wx.getSystemInfoSync()
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight}px`
  },
  //分页查询聊天记录
  chatList:function (){
    var url = app.d.hostUrl +'chat/chatRecord',that=this;
    var data={
      page:1,
      staff_id:app.globalData.staffId,
      uid:app.globalData.loginInfo.id,
      company_id:app.globalData.companyId,
    };
    app.http(url,data,'get',function(res){
      console.log(res);
      if(res.code==200){
        that.setData({ chatList: that.data.chatList.concat(res.data)})
      }
      
    })
  },
  //查询员工详情
  staffInfo:function(){
    var url = app.d.hostUrl +'company/staffInfo',that=this;
    var data={
      'staff_id':app.globalData.staffId,
      'company_id':app.globalData.companyId,
    }
    app.http(url,data,'get',function(res){
      console.log(res);
      that.setData({staffInfo:res.data});
    })
  },
  //增加聊天内容
  pushChat:function(data){
    var node = {
      'from_uid': app.globalData.loginInfo.id,
      'info': data,
      'type': data.type,
    }
    console.log(data);
    var list=this.data.chatList;
    var cnt=list.length-1;
    console.log(cnt)
    if(cnt>=0){
      list[cnt]['list'].push(node);
      console.log(list[cnt]);
    }else{
      var myDate = new Date();
      list = [{ 
        'group_time': myDate.toLocaleString(),
        'list': [node],
      }]
    }
    this.setData({ chatList:list})
  },
  //获取用户输入的内容
  inputMsg:function(e){
    this.setData({ msg: e.detail.value})
  },
  //发送文本内容
  sendMsg:function(){
    msg.text(this.data.msg);
    this.setData({msg:''});
  },
  //发送图片
  upImg:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.compress(tempFilePaths[0], '200', false, function (res) {
          that.uploadImg(res.tempFilePath,function(res){
            if(res.code==200){
              msg.image(res.data);
            }
            console.log(res);
          })
          console.log(res);
        });
      },
    })
  },
  //上传图片文件
  uploadImg(file, callBack) {
    wx.uploadFile({
      url: app.d.hostUrl + 'chat/uploadImg',
      filePath: file,
      name: 'file',
      formData: { 'sessionid': app.globalData.loginInfo.sessionid },
      success(res) {
        var res = JSON.parse(res.data);
        typeof callBack == 'function' && callBack(res);
      }
    })
  },
  //获取WebSocket通讯凭证
  token:function(time){
    var text = app.globalData.loginInfo.sessionid + time;
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
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  // 压缩图片
  compress(file, maxWidth, maxHeight, callback) {
    var that = this;
    //获取原图片信息
    wx.getImageInfo({
      src: file,
      success: function (res) {
        var width = res.width, height = res.height;
        if (width > maxWidth) {
          //超出限制宽度
          height = (maxWidth / width) * height;
          width = parseInt(maxWidth);
        }
        if (height > maxHeight && maxHeight) {
          //超出限制高度
          var ratio = that.data.thumbHeight / res.height;//计算比例
          width = (maxHeight / height) * width.toFixed(2);
          height = maxHeight.toFixed(2);
        }
        //设置比例压缩的高宽
        that.setData({ thumbWidth: width, thumbHeight: height });
        //延迟绘画
        setTimeout(function () {
          var ctx = wx.createCanvasContext('firstCanvas');
          ctx.drawImage(file, 0, 0, width, height);
          ctx.draw(false, function () {
            //绘画完成回调,生成图片
            wx.canvasToTempFilePath({
              canvasId: 'firstCanvas',
              success: function (res) {
                typeof callback == "function" && callback(res);
              }, fail(res) {
                console.log('失败:')
                console.log(res);
              }
            })
          });
        }, 100)
      }
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