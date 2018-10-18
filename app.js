//app.js
App({
  //配置
  d: {
    hostUrl: 'http://push.com/api/', //请求的主域名
  },
  globalData: {
    userInfo: '',//用户的基本信息
    // sessionid: '',//通信ID
    // staffId: '',//员工ID
    // companyId: '',//公司ID
    //sessionid: '47973dMzA0NDQmKh4aCgclRkdyO3ByZjQGUCUsX20lPQ',//通信ID
    staffId:83,//员工ID
    companyId:1,//公司ID
    loginInfo: {//登录用户的基本信息
      id: 84, sessionid: "bfa474MzA0NDQkLx0ZCwclRkdyO3ByZjQGUCUsX20lPQ", nickname: "独@步", photo: "https://wx.qlogo.cn/mmopen/vi_32/H8OEe2PXBInNuOBMW…LXUXiaH8rGUs1qKvwXuapRDwQY9tstmrRXDfiazcYERxQ/132"
    },
  },  
  onLaunch: function () {
  },
  //封装请求
  //参数1:路径
  //参数2:请求参数
  //参数3:请求类型
  //参数4:成功回调函数(函数名为error时为失败回调函数,可选)
  //参数5:失败回调函数(可选)
  http: function () {
    var that = this;
    var thAM=arguments;
    var data = thAM[1];
    data.sessionid = that.globalData.loginInfo.sessionid;
    wx.request({
      method: thAM[2],
      url: thAM[0],
      data: data,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        var res = res.data;  
        if (res.code == 200) {
          if (thAM[3] && thAM[3]['name'] != 'error') {  
            thAM[3](res)
          }
        } else if (res.code == 202) {
          console.log('登录已失效');
          //重新登录
          that.loginApi().then(function(res){
            console.log(res);
            that.globalData.loginInfo=res.data;
            that.http.apply(null,thAM);
          }).catch(function(res){
            console.log(res);
          })
        } else {
          if (thAM[4]) {
            thAM[4](res);
          } else if (thAM[3] && thAM[3]['name'] == 'error') {
            thAM[3](res);
          }
        }
      },
      fail: function () {
        that.error('网络错误');
      }
    })
  },
  //获取用户登录信息
  loginInfo: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      //尝试读取缓存
      wx.getStorage({
        key: 'loginInfo',
        success: function (res) {
          resolve(res.data)
        },
        fail: function () {
          that.loginApi().then(function(res){
            resolve(res.data)
          }).catch(function(res){
            reject(res);
          })
        }
      })
    })
  },
  //调用登录接口
  loginApi:function(){
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: res => {
          var data = that.globalData.userInfo;
          data.code = res.code;
          wx.request({
            method: 'post',
            url: that.d.hostUrl + 'index/login',
            data: data,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var res = res.data;
              if (res.code == 200) {
                //缓存用户登录信息
                wx.setStorage({ key: 'loginInfo', data: res.data });
                resolve(res);
              } else {
                reject(res.msg);
              }
            }
          })
        }
      })
    })
  },
  //提示窗口
  tishi: function (msg, callback) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: msg,
      success: function (res) {
        typeof callback == "function" && callback(res);
      }
    })
  },
  //格式化HTML字符串
  formattedHTML:function(html){
    return html.replace(/<[a-z]+/g, function (str) {
      switch (str) {
        case '<img':
          return '<img style="max-width:100%"';
          break;
        case '<table':
          return '<table style="border-spacing: 0px;width:94%;margin:3%"';
          break;
        case '<td':
          return '<td style="border:1px rgb(224,224,224) solid;"';
          break;
        default:
          return str;
          break;
      }
    })
  }

})