var app=getApp();
Component({
  properties: {  
    //接收页面传递过来的参数
    //例：prop: String,
    auth:null,//已授权回调函数
    unauth: null,//未授权回调函数
  },
  data:{
    //私有变量
    disabled:false,//防止重复授权
    bo: true,//控制组件显示（false）与隐藏(true),
  },
  created: function (options) {
    console.log('用了组件')
    var that=this;
    //检测是否已授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => { 
              app.globalData.userInfo = res.userInfo;  
              typeof that.data.auth == 'function' && that.data.auth();
            }
          })
        } else {
          //未授权
          that.setData({ bo: false })
          typeof that.data.unauth == 'function' && that.data.unauth();
        }
      }
    })
  },
  methods: {
    getUserInfo: function (e) {  
      //解决授权访问怎么都可以两次提交问题,不可以删除
      if (this.data.disabled) return false;
      this.setData({ disabled: true });
      if (e.detail.iv) {
        //授权成功
        this.setData({ bo: true })
        app.globalData.userInfo = e.detail.userInfo; 
        typeof this.data.auth == 'function' && this.data.auth();
      } else {
        //拒绝授权
        this.setData({ disabled: false });
      }
    }
  },
 
})