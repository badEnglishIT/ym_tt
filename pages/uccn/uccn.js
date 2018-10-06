// pages/uccn/uccn.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.details();
  },
  //查询公司详情
  details:function(){
    var that=this;
    var url=app.d.hostUrl+'company/details';
    var data = { 'company_id': app.globalData.companyId};
    app.http(url,data,'get',function(res){
      console.log(res);
      var details = app.formattedHTML(res.data.details);
      that.setData({details: details});
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})