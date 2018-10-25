//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    murky:false,
    toggle:false,
    scale:{},
    translateX:{},
    staffInfo:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar();
    //员工ID
    if (options.staffId) {
      app.globalData.staffId = options.staffId;
      app.globalData.companyId = options.companyId;
      this.setData({
        check: true,
        authCall: this.init,//已授权回调函数
      });
    }else{
      this.staffDetails();
    }  
  },
  init:function(){
    var that=this;
    app.loginInfo().then(function(res){
      app.globalData.loginInfo = res;
      that.staffDetails();
    }).catch(function(res){
      app.error('网络错误');
    })
  },
  //查询员工详情
  staffDetails:function(){
    wx.showTabBar({fail:function(res){
      console.log(res)
    }});
    console.log('隐藏')
    var that = this;
    var url = app.d.hostUrl + 'Company/staffDetails';
    var data = {
      id: app.globalData.staffId,
      company_id: app.globalData.companyId,
    };
    app.http(url, data, 'get', function (res) {
      var data=res.data;
      console.log(data);
      that.setData({ 
        staffInfo:data,
        nickname:data.nickname,//员工昵称
        address:data.address,//公司地址
        company_name:data.company_name,//公司名称
        job_title:data.info.job_title,//职位名称
        wechat:data.info.wechat,//微信号
        mail:data.info.mail,//邮箱
        intro: data.info.intro,//员工简介
        photo_wall: data.info.photo_wall,//员工照片墙
        photo:data.photo,//员工头像
        tel:data.tel,//员工电话
        look_card_user:data.look_card_user,//最近查看名片的用户
        click_like_cnt: data.click_like_cnt,//点赞总数
        look_card_cnt: data.look_card_cnt,//浏览总数
        is_click_like: data.is_click_like,//是否已点赞
      })
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //添加转发名片行为
    var url = app.d.hostUrl + 'Company/behavior';
    var data = {
      'staff_id': app.globalData.staffId,
      'company_id': app.globalData.companyId,
      'type': 3
    };
    app.http(url, data, 'post')
    var staffInfo = this.data.staffInfo;
    
    return {
      title: staffInfo.nickname+'的名片',
      path: 'pages/index/index?staffId=' + app.globalData.staffId + '&companyId=' + app.globalData.companyId,
    }
  },
  //跳转名片海报页面
  toPosterCard:function(){
    
    console.log(this.data.staffInfo);
    wx.navigateTo({
      url: '/pages/index/posterCard?info=' + JSON.stringify(this.data.staffInfo),
    })
  },
  //事件处理函数
  call:function(e){     //拨打电话
    console.log({ "功能": "拨打电话", "e": e });
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,//仅为示例，并非真实的电话号码
      success:function(res){
        //添加拨电话行为
        var url = app.d.hostUrl + 'Company/behavior';
        var data = {
          'staff_id': app.globalData.staffId,
          'company_id': app.globalData.companyId,
          'type': 7
        };
        app.http(url, data, 'post')
        console.log('拨打成功');
      }
    });
  },
  more:function(e){     //显示更多信息
    console.log({ "功能": "显示更多信息", "e": e });
    var now = !this.data.toggle;
    console.log(now);
    this.setData({
      toggle:now
    });
  },
  like:function(){   //点赞 点击改变图标 
    var animation = wx.createAnimation({     //点赞动画   点击放大缩小
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    animation.scale(1.2, 1.2).step().scale(1, 1).step();
    this.setData({
      scale: animation.export(),
      is_click_like: 1,
      click_like_cnt: this.data.click_like_cnt+1,
    });
    //添加点赞行为
    var url = app.d.hostUrl +'Company/behavior';
    var data = { 
      'staff_id': app.globalData.staffId,
      'company_id': app.globalData.companyId,
      'type':6
    };
    app.http(url,data,'post')
  },
  addPhone:function(){   //添加联系人到通讯录
    var data=this.data;
    wx.addPhoneContact({
      firstName: data.nickname,
      mobilePhoneNumber:data.tel,
      weChatNumber:data.wechat,
      organization:data.company_name,
      title:data.job_title,
      success: function (res) {
        console.log('拨打成功');
        //添加保存手机号行为
        var url = app.d.hostUrl + 'Company/behavior';
        var data = {
          'staff_id': app.globalData.staffId,
          'company_id': app.globalData.companyId,
          'type': 9
        };
        app.http(url, data, 'post')
      }
    })
  },
  copy:function(e){     //复制粘贴
    console.log({ "功能": "复制粘贴", "e": e });
    wx.setClipboardData({
      data: e.target.dataset.cont,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            //添加保存微信行为
            var url = app.d.hostUrl + 'Company/behavior';
            var data = {
              'staff_id': app.globalData.staffId,
              'company_id': app.globalData.companyId,
              'type': 2
            };
            app.http(url, data, 'post')
            console.log(res.data) // data
          }
        })
      }
    })
  },
  choose:function(e){     //选择分享方式 笼罩层
    var that = this;
    console.log({"功能":"选择分享方式 笼罩层","e":e});
    this.setData({
      murky:false
    });
    var animation = wx.createAnimation({     //底部弹出层   点击弹出
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "linear"
    })
    animation.translateY(-120).step();
    that.setData({
      translateX: animation.export()
    });
    
  },
  close:function(e){    //关闭选择 笼罩层消失
    var that = this;
    console.log({ "功能": "关闭分享方式 笼罩层消失", "e": e });
    this.setData({
      murky: true
    });
    var animation = wx.createAnimation({     //底部弹出层   点击弹出
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    animation.translateY(-0).step();
    that.setData({
      translateX: animation.export()
    });
  },
  toTalk:function(e){
    console.log({ "功能": "跳到聊天页面", "e": e });
    wx.navigateTo({
      url: './chat/chat',
    })
  },
  
})
