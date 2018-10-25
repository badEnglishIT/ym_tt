// pages/uccn/uccn.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      wx.showTabBar({
        fail: function (res) {
          console.log(res)
        }
      });
      that.details();
    }).catch(function (res) {
      app.error('网络错误');
    })
  },
  //查询公司详情
  details:function(){
    var that=this;
    var url=app.d.hostUrl+'company/details';
    var data = { 'company_id': app.globalData.companyId};
    app.http(url,data,'get',function(res){
      var data=res.data;
      data.details = app.formattedHTML(data.details);
      that.setData({ data: data});
    })
    //添加查看官网行为
    var url = app.d.hostUrl + 'Company/behavior';
    var data = {
      'staff_id': app.globalData.staffId,
      'company_id': app.globalData.companyId,
      'type': 1
    };
    app.http(url, data, 'post')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.company_name,
      path: '/pages/uccn/uccn?staffId=' + app.globalData.staffId + '&companyId=' + app.globalData.companyId,
    }
  }
})