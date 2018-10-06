// pages/companyList/companyList.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},//公司列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.companyList();   
  },
  //公司列表
  companyList:function(){
    var that=this;
    var url = app.d.hostUrl + 'Company/lists';
    app.http(url, [], 'get', function (res) {
      console.log(res)
      that.setData({list:res.data})
    });
  },
  //跳转员工列表
  toStaffs:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/carList/staffList/staffList?id=' + id,
    })
  },
})