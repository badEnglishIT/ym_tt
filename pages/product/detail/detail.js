// pages/product/detail/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title:'',
    price: '',
    banners: [],
    details: '',
    inventory: 0
  },
  // 自定义事件
  toShoppingCart(){
    wx.navigateTo({
      url: '/pages/shoppingCart/shoppingCart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id},this.details);
  },
  //查询商品详情
  details:function(){
    var that=this;
    var url=app.d.hostUrl+'Goods/details';
    var data = { 
      'id': this.data.id, 
      'company_id': app.globalData.companyId
    };
    app.http(url,data,'get',function(res){
      var details = app.formattedHTML(res.data.details);
      console.log(details);
      that.setData({
        title:res.data.title,
        price:res.data.price,
        banners:res.data.banners,
        details: details,
        inventory: res.data.inventory
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})