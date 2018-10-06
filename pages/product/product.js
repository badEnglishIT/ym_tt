// pages/product/product.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[],
    goodsList:[],
    currType:'',//默认为空查询全部商品
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.typeList();
    this.goodsList();
  },
  //查询分类列表
  typeList:function(){
    var that=this;
    var url = app.d.hostUrl +'Goods/typeList';
    var data = { 'company_id': app.globalData.companyId};
    app.http(url,data,'get',function(res){    
      that.setData({'typeList':res.data});
    })
  },
  //查询商品列表
  goodsList:function(){
    var that=this;
    var url = app.d.hostUrl + 'Goods/typeGoods';
    var data = { 
      'company_id': app.globalData.companyId ,
      'page':1,
      'typeId': this.data.currType,
    };
    app.http(url, data, 'get', function (res) {
      that.setData({goodsList:res.data});
    },function(){
      that.setData({ goodsList: [] });
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e);
  },
  // 选项卡
  swichNav: function (e) {
    var that = this;
    var currType = e.currentTarget.dataset.curr;
    if (currType != this.data.currType) {
      this.setData({
        currType: currType,
      },this.goodsList)   
    }
  },
  toShoppingCart() {
    wx.navigateTo({
      url: '/pages/shoppingCart/shoppingCart',
    })
  },
  toPersonal() {
    wx.navigateTo({
      url: '/pages/product/personal/personal',
    })
  },
})