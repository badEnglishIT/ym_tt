// pages/carList/staffList/staffList.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],//员工列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var url = app.d.hostUrl + 'Company/staffs';
    app.http(url, { id: options.id}, 'get', function (res) {
      console.log(res)
      that.setData({ list: res.data })
    });
  },
  //跳转到首页
  toIndex:function(e){
    app.globalData.companyId = e.currentTarget.dataset.company_id;
    app.globalData.staffId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: '/pages/index/index'
    })
  }

})