// pages/dynamic/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//动态ID
    data:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({id:options.id})
  },
  //查询详情
  queryDetails:function(){
    var url=app.d.hostUrl+'api/'
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})