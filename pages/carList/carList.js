// pages/carList/carList.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],//卡片列表
    authCall: '',//用户授权成功后的回调函数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ authCall: this.promiseRequest })
  },
  //流程化请求
  promiseRequest: function () {
    var that = this;
    app.loginInfo().then(function (res) {
      app.globalData.loginInfo = res;
      return that.cardList();
    }).then(function (res) {
      console.log(res)
      if (res.code==200) {
        that.setData({ list: res.data })
      } else {    
        that.toCompanyist();
      }
    }).catch(function (res) {
      console.log(res);
    })
  },
  //查询卡片列表
  cardList: function () {
    return new Promise(function (resolve, reject) {
      var url = app.d.hostUrl + 'Company/userRelStaffs';
      app.http(url, [], 'get', function (res) {
        resolve(res);
      },function(res){
        resolve(res);
      });
    })
  },
  //跳转到首页
  toIndex: function (e) {
    app.globalData.companyId = e.currentTarget.dataset.company_id;
    app.globalData.staffId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //跳转公司列表
  toCompanyist: function () {
    wx.redirectTo({
      url: '/pages/companyList/companyList',
    })
  },
})