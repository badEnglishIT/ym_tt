// pages/dynamic/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    data:'',
    check:false,
    staffInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({id:options.id});
    
    //员工ID
    if (options.staffId) {
      wx.hideTabBar();
      app.globalData.staffId = options.staffId;
      app.globalData.companyId = options.companyId;
      this.setData({
        check: true,
        authCall: this.init,//已授权回调函数
      });
    } else {
      this.details();
    }  
  },
  init: function () {
    var that = this;
    app.loginInfo().then(function (res) {
      app.globalData.loginInfo = res;
      that.details();
      that.staffInfo();
    }).catch(function (res) {
      app.error('网络错误');
    })
  },
  //查询员工信息
  staffInfo:function(){
    var url = app.d.hostUrl +'Company/staffInfo',that=this;
    var data={
      'staff_id':app.globalData.staffId,
      'company_id':app.globalData.companyId,
    };
    app.http(url,data,'get',function(res){
      that.setData({staffInfo:res.data})
    })
  },
  //查询详情
  details:function(){
    wx.showTabBar({
      fail: function (res) {
        console.log(res)
      }
    });
    var url = app.d.hostUrl +'Dynamic/details',that=this;
    var data={
      'id':this.data.id,
      'staffId':app.globalData.staffId,
      'companyId':app.globalData.companyId,
    };
    app.http(url,data,'get',function(res){
      console.log(res);
      res.data.details = app.formattedHTML(res.data.details);
      that.setData({data:res.data})
    })
  },
  //跳转员工页面
  toStaff:function(){
    console.log(11)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:this.data.title,
      path: '/pages/dynamic/detail?staffId=' + app.globalData.staffId + '&companyId=' + app.globalData.companyId+'&&id='+this.data.id,
    }
  }
})