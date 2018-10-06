// pages/dynamic/dynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[
      { img: '../../images/suibian.jpg', mode:'0'},
      { img: '../../images/Bosco.jpg', id: '1'},
      { img: '../../images/bosco1.jpg', id: '2'},
      { img: '../../images/Bosco.jpg', id: '3' },
      // { img: '../../images/suibian.jpg', id: '4' },
      // { img: '../../images/Bosco.jpg', id: '5' },
      // { img: '../../images/bosco1.jpg', id: '6' },
      // { img: '../../images/Bosco.jpg', id: '7' },
      // { img: '../../images/suibian.jpg', mode: '0' },
    ],
    asdf:['sa','ds','er','we'],
  },

  //事件处理
  preview:function(e){    //点击图片预览
    console.log(e);
    // wx.previewImage({
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})