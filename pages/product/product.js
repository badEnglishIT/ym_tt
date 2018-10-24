// pages/product/product.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyInfo:[],//公司基本信息
    typeList:[],
    goodsList:[],
    currType:'',//默认为空查询全部商品
    page: 1,
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.staffId) {
      app.globalData.staffId = options.staffId;
      app.globalData.companyId = options.companyId;
      this.setData({
        check: true,
        authCall: this.init,//已授权回调函数
      });
    } else {
      this.init();
    } 
    
  },
  init:function(){
    this.companyInfo();
    this.typeList();
    this.goodsList();
  },
  //查询公司基本信息
  companyInfo:function(){
    var that = this;
    var url = app.d.hostUrl + 'company/basicInfo';
    var data = { 'company_id': app.globalData.companyId };
    app.http(url, data, 'get', function (res) {
      that.setData({ 'companyInfo': res.data });
    })
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

  //下拉加载更多
  loadMore(e) {
    var that = this;
    console.log({ '加载更多': e });
    var beforePage = that.data.page;
    console.log({ '之前页': that.data.page });
    that.setData({ page: that.data.page + 1 });
    if (that.data.page != beforePage) {
      that.goodsList();
    }
  },

  //查询商品列表
  goodsList:function(){
    var that=this;
    var url = app.d.hostUrl + 'Goods/typeGoods';
    var data = { 
      'company_id': app.globalData.companyId ,
      'page':that.data.page,
      'typeId': that.data.currType,
    };
    app.http(url, data, 'get', function (res) {
      if(that.data.page==1){
        that.setData({goodsList:res.data});
      }else{
        that.setData({ goodsList: that.data.goodsList.concat(res.data) });
      }
    },function(res){
      console.log({ '异常': res });
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
      this.setData({currType: currType,page:1})
      this.goodsList();
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